/* ================================================================
 * BRIGADE MOBILE — AI Vision Analysis Module
 * Analyse l'état d'un smartphone via OpenAI GPT-4 Vision
 * ================================================================ */

import type { Condition } from './types.ts';

/** Défaut détecté par l'IA */
export interface DetectedDefect {
  type: 'scratch' | 'crack' | 'dent' | 'chip' | 'screen_crack' | 'screen_scratch' | 'back_crack' | 'discoloration' | 'wear' | 'missing_part' | 'burn_in';
  severity: 'minor' | 'moderate' | 'severe';
  location: string;
  description: string;
  impactScore: number; // 0-100 impact sur le prix
}

/** Résultat complet de l'analyse IA */
export interface VisionAnalysis {
  detectedBrand?: string;
  detectedModel?: string;
  aestheticScore: number;        // 0-100
  screenCondition: 'perfect' | 'micro-scratches' | 'scratched' | 'cracked';
  frameCondition: 'perfect' | 'scuffed' | 'dented' | 'bent';
  cameraCondition: 'perfect' | 'scratched' | 'blurry' | 'broken';
  fraudRisk: number;             // 0-100
  confidence: number;            // 0-100
  repairEstimate: number;        // en €
  estimatedGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  defects: DetectedDefect[];
  summary: string;
  provider?: string;
  fallbackErrors?: string[];
}

export interface VisionProviderKeys {
  openai?: string;
  gemini?: string;
  groq?: string;
}

/** Score → Condition mapping */
function scoreToCondition(score: number): Condition {
  if (score >= 95) return 'neuf';
  if (score >= 85) return 'comme-neuf';
  if (score >= 70) return 'tres-bon';
  if (score >= 50) return 'bon';
  if (score >= 25) return 'correct';
  return 'casse';
}

/** Prompt système pour l'analyse IA — version détaillée */
const SYSTEM_PROMPT = `Tu es un expert certifié en évaluation de smartphones reconditionnés pour un service professionnel de reprise (Brigade Mobile, Toulouse).

Tu reçois plusieurs photos (face avant, arrière, côtés, écran allumé, caméra).
Tu dois analyser les rayures, fissures, impacts, état du châssis, état de l'écran, état de la caméra, la cohérence des photos et le niveau de risque de fraude.

STRUCTURE JSON REQUISE :
{
  "detectedBrand": "<Marque détectée, ex: Apple, Samsung, ou null si impossible>",
  "detectedModel": "<Modèle exact détecté, ex: iPhone 14 Pro, Galaxy S23, ou null si impossible>",
  "aestheticScore": <number 0-100, 100=neuf parfait>,
  "screenCondition": "perfect" | "micro-scratches" | "scratched" | "cracked",
  "frameCondition": "perfect" | "scuffed" | "dented" | "bent",
  "cameraCondition": "perfect" | "scratched" | "blurry" | "broken",
  "fraudRisk": <number 0-100, basé sur la cohérence des photos et l'état>,
  "confidence": <number 0-100>,
  "repairEstimate": <number, coût estimé des réparations en euros>,
  "estimatedGrade": "A+" | "A" | "B" | "C" | "D",
  "summary": "<rapport d'expertise en 2-3 sentences en français>",
  "defects": [
    {
      "type": "<scratch|crack|dent|chip|screen_crack|screen_scratch|back_crack|discoloration|wear|missing_part>",
      "severity": "<minor|moderate|severe>",
      "location": "<localisation précise en français>",
      "description": "<description détaillée en français>",
      "impactScore": <number 0-100>
    }
  ]
}

GRILLE DE GRADES :
- A+ (Neuf) : 95-100. Aucune trace.
- A (Très bon) : 85-94. Micro-traces invisibles à 20cm.
- B (Bon) : 70-84. Traces d'usure normales.
- C (Correct) : 50-69. Chocs ou rayures visibles.
- D (Hors d'usage) : <50. Fissures ou composants cassés.`;

function parseAnalysis(raw: string): VisionAnalysis {
  let parsed: any;
  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(clean);
  } catch {
    throw new Error(`Impossible de parser la réponse IA: ${raw.slice(0, 200)}`);
  }

  const defects: DetectedDefect[] = (parsed.defects || []).map((d: any) => ({
    type: d.type || 'wear',
    severity: d.severity || 'minor',
    location: d.location || 'Non spécifié',
    description: d.description || '',
    impactScore: Math.max(0, Math.min(100, d.impactScore ?? 10)),
  }));

  return {
    detectedBrand: parsed.detectedBrand || undefined,
    detectedModel: parsed.detectedModel || undefined,
    aestheticScore: Math.max(0, Math.min(100, parsed.aestheticScore ?? 50)),
    screenCondition: parsed.screenCondition || 'perfect',
    frameCondition: parsed.frameCondition || 'perfect',
    cameraCondition: parsed.cameraCondition || 'perfect',
    fraudRisk: Math.max(0, Math.min(100, parsed.fraudRisk ?? 0)),
    confidence: Math.max(0, Math.min(100, parsed.confidence ?? 50)),
    repairEstimate: parsed.repairEstimate ?? 0,
    estimatedGrade: parsed.estimatedGrade || 'B',
    defects,
    summary: parsed.summary || 'Analyse complétée.',
  };
}

/** Analyse des photos via OpenAI GPT-4 Vision */
export async function analyzePhotos(
  images: { base64: string; mimeType: string; label: string }[],
  apiKey: string,
): Promise<VisionAnalysis> {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY non configurée');
  }

  if (images.length === 0) {
    throw new Error('Aucune photo fournie');
  }

  // Construire les messages avec les images
  const imageContent = images.map(img => ({
    type: 'image_url' as const,
    image_url: {
      url: `data:${img.mimeType};base64,${img.base64}`,
      detail: 'high' as const,
    },
  }));

  const userContent = [
    {
      type: 'text' as const,
      text: `Analyse ces ${images.length} photo(s) d'un smartphone (${images.map(i => i.label).join(', ')}). Retourne UNIQUEMENT le JSON d'analyse, pas de texte autour.`,
    },
    ...imageContent,
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim();

  if (!raw) {
    throw new Error('Réponse vide de l\'IA');
  }

  return parseAnalysis(raw);
}

/** Analyse des photos via Google Gemini Vision */
export async function analyzePhotosWithGemini(
  images: { base64: string; mimeType: string; label: string }[],
  apiKey: string,
): Promise<VisionAnalysis> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY non configurée');
  }

  if (images.length === 0) {
    throw new Error('Aucune photo fournie');
  }

  const parts = [
    {
      text: `${SYSTEM_PROMPT}\n\nAnalyse ces ${images.length} photo(s) d'un smartphone (${images.map(i => i.label).join(', ')}). Retourne UNIQUEMENT le JSON d'analyse, pas de texte autour.`,
    },
    ...images.map(img => ({
      inline_data: {
        mime_type: img.mimeType,
        data: img.base64,
      },
    })),
  ];

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2000,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!raw) {
    throw new Error('Réponse vide de Gemini');
  }

  return parseAnalysis(raw);
}

/** Analyse des photos via Groq (Llama 4 Scout Vision) */
export async function analyzePhotosWithGroq(
  images: { base64: string; mimeType: string; label: string }[],
  apiKey: string,
): Promise<VisionAnalysis> {
  if (!apiKey) {
    throw new Error('GROQ_API_KEY non configurée');
  }

  if (images.length === 0) {
    throw new Error('Aucune photo fournie');
  }

  const imageContent = images.map(img => ({
    type: 'image_url' as const,
    image_url: {
      url: `data:${img.mimeType};base64,${img.base64}`,
    },
  }));

  const userContent = [
    {
      type: 'text' as const,
      text: `Analyse ces ${images.length} photo(s) d'un smartphone (${images.map(i => i.label).join(', ')}). Retourne UNIQUEMENT le JSON d'analyse, pas de texte autour.`,
    },
    ...imageContent,
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim();

  if (!raw) {
    throw new Error('Réponse vide de Groq');
  }

  return parseAnalysis(raw);
}

export async function analyzePhotosWithFallback(
  images: { base64: string; mimeType: string; label: string }[],
  keys: VisionProviderKeys,
  preferredProviders: string[] = ['openai', 'gemini', 'groq'],
): Promise<VisionAnalysis> {
  const errors: string[] = [];

  for (const provider of preferredProviders) {
    try {
      if (provider === 'openai' && keys.openai) {
        const analysis = await analyzePhotos(images, keys.openai);
        return { ...analysis, provider: 'openai', fallbackErrors: errors };
      }

      if (provider === 'gemini' && keys.gemini) {
        const analysis = await analyzePhotosWithGemini(images, keys.gemini);
        return { ...analysis, provider: 'gemini', fallbackErrors: errors };
      }

      if (provider === 'groq' && keys.groq) {
        const analysis = await analyzePhotosWithGroq(images, keys.groq);
        return { ...analysis, provider: 'groq', fallbackErrors: errors };
      }

      errors.push(`${provider}: clé API absente`);
    } catch (error: any) {
      errors.push(`${provider}: ${error.message || 'erreur inconnue'}`);
    }
  }

  throw new Error(`Tous les providers IA ont échoué. ${errors.join(' | ')}`);
}
