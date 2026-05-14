import type { APIRoute } from 'astro';
import { analyzePhotosWithFallback } from '../../engine/vision.ts';

export const prerender = false;

/**
 * POST /api/analyze-phone
 *
 * Body :
 * {
 *   "images": [
 *     { "base64": "<base64 data>", "mimeType": "image/jpeg", "label": "Écran" },
 *     { "base64": "<base64 data>", "mimeType": "image/jpeg", "label": "Dos" },
 *     { "base64": "<base64 data>", "mimeType": "image/jpeg", "label": "Côtés" }
 *   ]
 * }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const openaiKey = import.meta.env.OPENAI_API_KEY;
    const geminiKey = import.meta.env.GEMINI_API_KEY;
    const groqKey = import.meta.env.GROQ_API_KEY;
    const providerOrder = (import.meta.env.VISION_PROVIDER_ORDER || 'gemini,openai,groq')
      .split(',')
      .map((p: string) => p.trim().toLowerCase())
      .filter(Boolean);

    if (!openaiKey && !geminiKey && !groqKey) {
      return json({
        error: 'Aucune clé IA configurée. Ajoutez OPENAI_API_KEY, GEMINI_API_KEY ou GROQ_API_KEY dans votre fichier .env',
      }, 400);
    }

    const body = await request.json();
    const images = body.images;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return json({ error: 'Aucune image fournie' }, 400);
    }

    if (images.length > 5) {
      return json({ error: 'Maximum 5 images autorisées' }, 400);
    }

    // Vérifier la taille totale (max ~10MB en base64)
    const totalSize = images.reduce((sum: number, img: any) => sum + (img.base64?.length || 0), 0);
    if (totalSize > 15_000_000) {
      return json({ error: 'Images trop volumineuses. Veuillez réduire la taille.' }, 400);
    }

    const analysis = await analyzePhotosWithFallback(
      images,
      {
        openai: openaiKey,
        gemini: geminiKey,
        groq: groqKey,
      },
      providerOrder,
    );

    return json({
      success: true,
      analysis,
      provider: analysis.provider,
      fallbackErrors: analysis.fallbackErrors || [],
    });
  } catch (err: any) {
    console.error('[analyze-phone] Error:', err);
    return json({
      error: err.message || 'Erreur lors de l\'analyse',
      success: false,
    }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
