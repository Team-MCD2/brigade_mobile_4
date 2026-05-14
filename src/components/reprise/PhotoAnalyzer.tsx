import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ======== TYPES ======== */
interface DetectedDefect {
  type: string;
  severity: 'minor' | 'moderate' | 'severe';
  location: string;
  description: string;
  impactScore: number;
}

interface VisionAnalysis {
  aestheticScore: number;
  screenCondition: string;
  frameCondition: string;
  cameraCondition: string;
  fraudRisk: number;
  confidence: number;
  repairEstimate: number;
  estimatedGrade: string;
  defects: DetectedDefect[];
  summary: string;
}

interface PhotoSlot {
  id: string;
  label: string;
  image: string;
  file: File | null;
  preview: string | null;
  required?: boolean;
}

interface Props {
  onAnalysisComplete: (analysis: VisionAnalysis) => void;
  onSkip: () => void;
  autoSubmit?: boolean;
}

/* ======== DESIGN ======== */
const T = {
  bg: '#f5f5f7',
  surface: 'rgba(255, 255, 255, 0.7)',
  card: 'rgba(0, 0, 0, 0.03)',
  border: 'rgba(0, 0, 0, 0.08)',
  accent: '#0071e3', // Apple Blue
  accentGlow: 'rgba(0, 113, 227, 0.2)',
  accentSoft: 'rgba(0, 113, 227, 0.08)',
  green: '#34c759',
  greenGlow: 'rgba(52, 199, 89, 0.2)',
  greenSoft: 'rgba(52, 199, 89, 0.08)',
  red: '#ff3b30',
  redSoft: 'rgba(255, 59, 48, 0.08)',
  amber: '#f59e0b',
  amberSoft: 'rgba(245, 158, 11, 0.08)',
  white: '#ffffff',
  t1: '#1d1d1f',
  t2: '#86868b',
  t3: '#a1a1aa',
};

const SEVERITY_COLORS: Record<string, string> = {
  minor: T.amber,
  moderate: '#f97316',
  severe: T.red,
};

/* ======== UTILS ======== */
async function resizeImage(file: File, maxWidth = 1280, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas support required'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ======== MAIN COMPONENT ======== */
export default function PhotoAnalyzer({ onAnalysisComplete, onSkip, autoSubmit }: Props) {
  const [slots, setSlots] = useState<PhotoSlot[]>([
    { id: 'front', label: 'Face avant', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=320&q=80', file: null, preview: null, required: true },
    { id: 'back', label: 'Arrière', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=320&q=80', file: null, preview: null, required: true },
    { id: 'sides', label: 'Côtés', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=320&q=80', file: null, preview: null },
    { id: 'screen_on', label: 'Écran allumé', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=320&q=80', file: null, preview: null },
    { id: 'camera', label: 'Caméras', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=320&q=80', file: null, preview: null },
  ]);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<VisionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFile = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) return;
    const preview = URL.createObjectURL(file);
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, file, preview } : s));
  };

  const removePhoto = (index: number) => {
    setSlots(prev => prev.map((s, i) => {
      if (i === index) {
        if (s.preview) URL.revokeObjectURL(s.preview);
        return { ...s, file: null, preview: null };
      }
      return s;
    }));
  };

  const startAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const images = [];
      for (const slot of slots) {
        if (slot.file) {
          const base64Full = await resizeImage(slot.file);
          images.push({
            base64: base64Full.split(',')[1],
            mimeType: 'image/jpeg',
            label: slot.label,
          });
        }
      }

      const res = await fetch('/api/analyze-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });

      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      if (autoSubmit) {
        onAnalysisComplete(data.analysis);
      } else {
        setResult(data.analysis);
      }
    } catch (err: any) {
      setError(err.message || "L'analyse a échoué. Veuillez réessayer.");
    } finally {
      setAnalyzing(false);
    }
  };

  // UI Result
  if (result) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <div style={{ background: T.surface, backdropFilter: 'blur(20px)', borderRadius: 24, border: `1px solid ${T.border}`, padding: 32, marginBottom: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, marginBottom: 32, flexWrap: 'wrap' }}>
            {/* Main Score */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                  <circle cx="70" cy="70" r="64" fill="none" stroke={T.border} strokeWidth="8" />
                  <motion.circle cx="70" cy="70" r="64" fill="none" stroke={T.accent} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray="402" initial={{ strokeDashoffset: 402 }}
                    animate={{ strokeDashoffset: 402 - (result.aestheticScore / 100) * 402 }}
                    transition={{ duration: 2, ease: 'easeOut' }} />
                </svg>
                <div>
                  <div style={{ fontSize: 44, fontWeight: 900, color: T.t1 }}>{result.aestheticScore}</div>
                  <div style={{ fontSize: 10, color: T.t3, textTransform: 'uppercase', letterSpacing: 1 }}>Aesthetic Score</div>
                </div>
              </div>
            </div>

            {/* Sub-metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Metric label="Écran" status={result.screenCondition} color={conditionColor(result.screenCondition)} />
              <Metric label="Châssis" status={result.frameCondition} color={conditionColor(result.frameCondition)} />
              <Metric label="Caméra" status={result.cameraCondition} color={conditionColor(result.cameraCondition)} />
              <Metric label="Risque IA" status={`${result.fraudRisk}%`} color={result.fraudRisk < 20 ? T.green : T.red} />
            </div>
          </div>

          <div style={{ padding: '16px 20px', background: T.accentSoft, borderRadius: 16, border: `1px solid ${T.accent}40`, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', color: T.accent, fontWeight: 700, marginBottom: 4 }}>Expertise Grade</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: T.t1 }}>Grade {result.estimatedGrade}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', color: T.t3, fontWeight: 700, marginBottom: 4 }}>Réparation Est.</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: T.amber }}>{result.repairEstimate}€</div>
              </div>
            </div>
          </div>

          <p style={{ color: T.t2, fontSize: 14, lineHeight: 1.6, margin: 0, textAlign: 'center' }}>{result.summary}</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setResult(null)} style={{ flex: 1, padding: 16, borderRadius: 14, border: `1.5px solid ${T.border}`, background: 'transparent', color: T.t1, fontWeight: 600, cursor: 'pointer' }}>Ré-analyser</button>
          <button onClick={() => onAnalysisComplete(result)} style={{ flex: 2, padding: 16, borderRadius: 14, border: 'none', background: T.accent, color: T.white, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 20px ${T.accentGlow}` }}>Appliquer le diagnostic</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Upload Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
        {slots.map((slot, index) => (
          <div key={slot.id} style={{ position: 'relative', aspectRatio: '3/4', background: T.card, borderRadius: 16, border: `1px solid ${slot.preview ? T.accent : T.border}`, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => !slot.preview && fileRefs.current[index]?.click()}>
            {slot.preview ? (
              <>
                <img src={slot.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {analyzing && (
                  <motion.div initial={{ top: '-10%' }} animate={{ top: '110%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', left: 0, right: 0, height: 2, background: T.accent, boxShadow: `0 0 15px ${T.accent}`, zIndex: 10 }} />
                )}
                <button onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                  style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: T.white, fontSize: 10 }}>✕</button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6 }}>
                <img src={slot.image} alt={slot.label} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.42 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.82))' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(10px)', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: 12, color: T.t1, fontWeight: 800 }}>{slot.label}</span>
                  {slot.required && <span style={{ display: 'block', marginTop: 4, fontSize: 8, color: T.red, textTransform: 'uppercase', fontWeight: 800, letterSpacing: 0.7 }}>Requis</span>}
                </div>
              </div>
            )}
            <input ref={el => { fileRefs.current[index] = el; }} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(index, e.target.files[0])} />
          </div>
        ))}
      </div>

      {error && <div style={{ background: T.redSoft, color: T.red, padding: '12px 16px', borderRadius: 12, marginBottom: 16, fontSize: 13 }}>⚠️ {error}</div>}

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onSkip} style={{ flex: 1, padding: 14, borderRadius: 12, border: `1px solid ${T.border}`, background: T.surface, color: T.t1, fontWeight: 600, cursor: 'pointer' }}>Passer l'IA</button>
        <button disabled={analyzing || !slots[0].file || !slots[1].file} onClick={startAnalysis}
          style={{ flex: 2, padding: 14, borderRadius: 12, border: 'none', background: slots[0].file && slots[1].file ? T.accent : 'rgba(0,0,0,0.1)', color: slots[0].file && slots[1].file ? T.white : T.t3, fontWeight: 700, cursor: slots[0].file && slots[1].file ? 'pointer' : 'default', transition: 'all 0.3s' }}>
          {analyzing ? 'Analyse IA en cours...' : 'Lancer le diagnostic photo'}
        </button>
      </div>

      {analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ position: 'relative', width: 200, height: 200 }}>
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
               style={{ position: 'absolute', inset: 0, border: `2px dashed ${T.accent}`, borderRadius: '50%', opacity: 0.3 }} />
             <div style={{ position: 'absolute', inset: 20, border: `2px solid ${T.accent}`, borderRadius: '50%', boxShadow: `0 0 30px ${T.accentGlow}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <motion.img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=220&q=80" alt="Analyse téléphone" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 24 }} />
             </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: T.t1, margin: 0, fontSize: 20 }}>Analyse Intelligente</h3>
            <p style={{ color: T.t2, margin: '8px 0 0', fontSize: 14 }}>Détection de la marque et des imperfections...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Metric({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div style={{ background: 'rgba(0,0,0,0.03)', border: `1px solid ${T.border}`, padding: '10px 14px', borderRadius: 12, minWidth: 100 }}>
      <div style={{ fontSize: 10, color: T.t2, textTransform: 'uppercase', marginBottom: 2, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color }}>{status.replace('-', ' ')}</div>
    </div>
  );
}

function conditionColor(cond: string): string {
  if (cond === 'perfect' || cond.includes('A+')) return T.green;
  if (cond === 'micro-scratches' || cond === 'scuffed') return T.amber;
  return T.red;
}
