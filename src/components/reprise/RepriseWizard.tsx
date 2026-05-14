import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brands, type Brand, type PhoneModel } from '../../data/phones';
import { calculateReprise, type Condition, type DeviceState } from '../../utils/pricing';
import PhotoAnalyzer from './PhotoAnalyzer';
import PricingSummary from './PricingSummary';
import AnimatedBg from './AnimatedBg';

const T = {
  accent: '#0071e3', // Apple Blue
  green: '#34c759', // Apple Green
  t1: '#1d1d1f', // Dark gray/black for text
  t2: '#86868b', // Light gray for subtitles
  t3: '#a1a1aa',
  border: 'rgba(0, 0, 0, 0.08)',
  glass: 'rgba(255, 255, 255, 0.7)',
  blur: 'blur(20px)',
  shadow: '0 4px 24px rgba(0,0,0,0.04)',
};

const LOGOS: Record<string, string> = {
  apple: 'https://cdn.simpleicons.org/apple/111111',
  samsung: 'https://cdn.simpleicons.org/samsung/1428a0',
  google: 'https://cdn.simpleicons.org/google/4285f4',
  huawei: 'https://cdn.simpleicons.org/huawei/c7000b',
  xiaomi: 'https://cdn.simpleicons.org/xiaomi/ff6900',
  oneplus: 'https://cdn.simpleicons.org/oneplus/eb0028',
  oppo: 'https://cdn.simpleicons.org/oppo/046a38',
  honor: 'https://cdn.simpleicons.org/honor/000000',
  nothing: 'https://cdn.simpleicons.org/nothing/111111',
  sony: 'https://cdn.simpleicons.org/sony/000000',
  motorola: 'https://cdn.simpleicons.org/motorola/5c2d91'
};

const MODEL_IMAGES: Record<string, string> = {
  apple: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=180&q=80',
  samsung: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=180&q=80',
  google: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=180&q=80',
  huawei: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=180&q=80',
  xiaomi: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=180&q=80',
  oneplus: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=180&q=80',
  oppo: 'https://images.unsplash.com/photo-1551355738-1875fd572064?auto=format&fit=crop&w=180&q=80',
  honor: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=180&q=80',
  nothing: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=180&q=80',
  sony: 'https://images.unsplash.com/photo-1533228100845-08145b01de14?auto=format&fit=crop&w=180&q=80',
  default: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=180&q=80'
};

const STEPS = [
  { t: 'Marque', s: 'Constructeur' }, { t: 'Modèle', s: 'Génération' }, { t: 'Stockage', s: 'Capacité' },
  { t: 'État', s: 'Visuel' }, { t: 'Batterie', s: 'Santé' }, { t: 'Écran', s: 'Affichage' },
  { t: 'Caméra', s: 'Capteurs' }, { t: 'Réseau', s: 'Connectivité' }, { t: 'IA Photo', s: 'Analyse' },
  { t: 'Résumé', s: 'Vérification' }, { t: 'Offre', s: 'Estimation' }
];

const OptionCard = ({ onClick, active, label, subtitle, logoId, image }: any) => {
  const [imgErr, setImgErr] = useState(false);
  const imageSrc = image || (logoId ? LOGOS[logoId] : null);
  return (
    <motion.button whileHover={{ scale: 1.01, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }} whileTap={{ scale: 0.98 }} onClick={onClick}
      style={{ 
        padding: '20px', borderRadius: 20, border: `1px solid ${active ? T.accent : T.border}`, 
        background: active ? 'rgba(0, 113, 227, 0.08)' : T.glass, backdropFilter: T.blur,
        boxShadow: active ? `0 0 0 1px ${T.accent}, ${T.shadow}` : T.shadow,
        cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, width: '100%', transition: '0.3s'
      }}>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
        {imageSrc && !imgErr ? (
          <img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: logoId ? 'contain' : 'cover', padding: logoId ? 12 : 0, boxSizing: 'border-box' }} alt={label} referrerPolicy="no-referrer" onError={() => setImgErr(true)} />
        ) : (
          <span style={{ color: T.t2, fontSize: 13, fontWeight: 800 }}>{String(label).slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: T.t1, fontSize: 17 }}>{label}</div>
        {subtitle && <div style={{ fontSize: 13, color: T.t2, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </motion.button>
  );
};

export default function RepriseWizard() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [model, setModel] = useState<PhoneModel | null>(null);
  const [capacity, setCapacity] = useState('');
  const [condition, setCondition] = useState<Condition | null>(null);
  const [states, setStates] = useState<any>({ bat:null, scr:null, cam:null, net:null });
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  // === AI Magic Flow State ===
  const [isMagicPhoto, setIsMagicPhoto] = useState(false);
  const [isMagicConfirm, setIsMagicConfirm] = useState(false);
  const [aiDetection, setAiDetection] = useState<{brand: string, model: string} | null>(null);

  const handleAi = (res: any) => {
    const grades: any = { 'A+': 'neuf', 'A': 'comme-neuf', 'B': 'tres-bon', 'C': 'bon', 'D': 'correct' };
    setCondition(grades[res.estimatedGrade] || 'bon');
    setStates({ bat:'excellent', scr: res.screenCondition, cam: res.cameraCondition, net:'perfect' });
    setAiScore(res.aestheticScore); setDir(1); setStep(9);
  };

  const mp = useMemo(() => model && capacity ? (model.marketPrice[capacity] || 0) : 0, [model, capacity]);
  const pricing = useMemo(() => condition && mp ? calculateReprise(mp, { condition, batteryChanged: states.bat==='replaced', screenOriginal: states.scr!=='replaced', biometricWorks: states.cam!=='broken', unlocked: true, hasCharger: true, hasBox: true }, model?.id, capacity, aiScore || undefined) : null, [mp, condition, states, model, capacity, aiScore]);

  const go = (d: 1 | -1) => { setDir(d); setStep(s => Math.max(0, Math.min(STEPS.length - 1, s + d))); };

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: T.t1 }}>
      <AnimatedBg />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: 80, marginBottom: 20, color: T.green }}>✓</div>
        <h2 style={{ fontSize: 40, fontWeight: 900, color: T.t1 }}>Offre validée.</h2>
        <p style={{ color: T.t2, marginBottom: 40 }}>{pricing?.finalPrice}€ pour votre {model?.name}</p>
        <a href="/" style={{ padding: '16px 40px', background: T.t1, color: '#fff', borderRadius: 24, textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</a>
      </div>
    </div>
  );

  if (isMagicPhoto) {
    return (
      <div style={{ minHeight: '100vh', background: 'transparent', color: T.t1, fontFamily: 'Outfit, sans-serif', position: 'relative', overflowX: 'hidden' }}>
        <AnimatedBg />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 500, margin: '0 auto', padding: '40px 20px' }}>
           <button onClick={() => setIsMagicPhoto(false)} style={{ background: 'none', border: 'none', color: T.t2, cursor: 'pointer', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>← Retour</button>
           <h2 style={{fontSize: 32, fontWeight: 900, marginBottom: 8}}>Identification IA ✨</h2>
           <p style={{marginBottom: 30, color: T.t2}}>Prenez votre téléphone en photo. Notre IA va identifier la marque, le modèle et évaluer son état instantanément.</p>
           <PhotoAnalyzer 
             autoSubmit={true}
             onAnalysisComplete={(analysis) => {
               if (analysis.detectedBrand && analysis.detectedModel) {
                  setAiDetection({ brand: analysis.detectedBrand, model: analysis.detectedModel });
                  const grades: any = { 'A+': 'neuf', 'A': 'comme-neuf', 'B': 'tres-bon', 'C': 'bon', 'D': 'correct' };
                  setCondition(grades[analysis.estimatedGrade] || 'bon');
                  setStates({ bat:'excellent', scr: analysis.screenCondition, cam: analysis.cameraCondition, net:'perfect' });
                  setAiScore(analysis.aestheticScore);
                  setIsMagicPhoto(false);
                  setIsMagicConfirm(true);
               } else {
                  setIsMagicPhoto(false);
                  const autre = brands.find(b => b.id === 'autre');
                  if (autre) { setBrand(autre); go(1); }
               }
             }} 
             onSkip={() => {
               setIsMagicPhoto(false);
               const autre = brands.find(b => b.id === 'autre');
               if (autre) { setBrand(autre); go(1); }
             }} 
           />
        </div>
      </div>
    );
  }

  if (isMagicConfirm && aiDetection) {
    return (
      <div style={{ minHeight: '100vh', background: 'transparent', color: T.t1, fontFamily: 'Outfit, sans-serif', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatedBg />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 500, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✨</div>
          <h2 style={{ fontSize: 32, fontWeight: 900 }}>Magie de l'IA !</h2>
          <p style={{ fontSize: 18, color: T.t2, marginBottom: 40 }}>
            Nous avons détecté un <strong style={{color: T.t1}}>{aiDetection.brand} {aiDetection.model}</strong>. Est-ce bien votre téléphone ?
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button onClick={() => {
               setIsMagicConfirm(false);
               let foundBrand = brands.find(b => b.name.toLowerCase().includes(aiDetection.brand.toLowerCase()));
               let foundModel = foundBrand ? foundBrand.models.find(m => m.name.toLowerCase().includes(aiDetection.model.toLowerCase())) : null;
               
               if (foundBrand && foundModel) {
                   setBrand(foundBrand);
                   setModel(foundModel);
                   setCapacity(foundModel.capacities[0]);
               } else {
                   const autre = brands.find(b => b.id === 'autre');
                   if (autre) {
                       setBrand(autre);
                       setModel(autre.models[0]);
                       setCapacity(autre.models[0].capacities[0]);
                   }
               }
               setStep(10); // Saut direct vers le prix !
            }} style={{ padding: '20px', borderRadius: 20, border: 'none', background: T.accent, color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(0, 113, 227, 0.3)' }}>
              ✅ Oui, c'est bien ça !
            </button>
            
            <button onClick={() => {
               setIsMagicConfirm(false);
               const autre = brands.find(b => b.id === 'autre');
               if (autre) { setBrand(autre); setStep(1); }
            }} style={{ padding: '20px', borderRadius: 20, border: `1px solid ${T.border}`, background: T.glass, color: T.t1, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              ❌ Non, choisir manuellement
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', color: T.t1, fontFamily: 'Outfit, sans-serif', position: 'relative', overflowX: 'hidden' }}>
      <AnimatedBg />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 500, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => step > 0 && go(-1)} style={{ background: 'none', border: 'none', color: T.t2, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>← Retour</button>
          <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2, marginTop: 10 }}>
            <motion.div animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} style={{ height: '100%', background: T.accent, borderRadius: 2 }} />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} initial={{ x: dir * 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 50, opacity: 0 }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>{STEPS[step].t}</h1>
            <p style={{ color: T.t2, marginBottom: 30 }}>{STEPS[step].s}</p>

            <div style={{ display: 'grid', gap: 10 }}>
              {step === 0 && brands.map(b => <OptionCard key={b.id} active={brand?.id === b.id} label={b.name} logoId={b.id} onClick={() => { 
                if (b.id === 'autre') {
                  setIsMagicPhoto(true);
                } else {
                  setBrand(b); go(1); 
                }
              }} />)}
              {step === 1 && brand?.models.map(m => <OptionCard key={m.id} active={model?.id === m.id} label={m.name} image={MODEL_IMAGES[brand.id] || MODEL_IMAGES.default} onClick={() => { setModel(m); go(1); }} />)}
              {step === 2 && model && Object.keys(model.marketPrice).map(c => <OptionCard key={c} active={capacity === c} label={c} image="https://images.unsplash.com/photo-1606041011872-596597976b25?auto=format&fit=crop&w=180&q=80" onClick={() => { setCapacity(c); go(1); }} />)}
              {step === 3 && ['neuf','comme-neuf','tres-bon','bon','correct','casse'].map(c => <OptionCard key={c} active={condition === c} label={c} image="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=180&q=80" onClick={() => { setCondition(c as any); go(1); }} />)}
              {step === 4 && ['excellent','good','fair','replaced'].map(o => <OptionCard key={o} active={states.bat === o} label={o} image="https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=180&q=80" onClick={() => { setStates({...states, bat:o}); go(1); }} />)}
              {step === 5 && ['perfect','scratched','cracked','replaced'].map(o => <OptionCard key={o} active={states.scr === o} label={o} image="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=180&q=80" onClick={() => { setStates({...states, scr:o}); go(1); }} />)}
              {step === 6 && ['perfect','scratched','broken'].map(o => <OptionCard key={o} active={states.cam === o} label={o} image="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=180&q=80" onClick={() => { setStates({...states, cam:o}); go(1); }} />)}
              {step === 7 && ['perfect','locked','imei_blocked'].map(o => <OptionCard key={o} active={states.net === o} label={o} image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=180&q=80" onClick={() => { setStates({...states, net:o}); go(1); }} />)}
              {step === 8 && <PhotoAnalyzer onAnalysisComplete={handleAi} onSkip={() => go(1)} />}
              {step === 9 && (
                <div style={{ padding: 24, background: T.glass, borderRadius: 24, boxShadow: T.shadow, border: T.border }}>
                  <p style={{ color: T.t1, fontWeight: 600 }}>Appareil : {model?.name}</p><p style={{ color: T.t1, fontWeight: 600 }}>Stockage : {capacity}</p>
                  <button onClick={() => go(1)} style={{ width: '100%', padding: 18, marginTop: 20, borderRadius: 20, border: 'none', background: T.accent, color: '#fff', fontWeight: 600, fontSize: 16 }}>Obtenir l'estimation</button>
                </div>
              )}
              {step === 10 && pricing && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ padding: 48, background: T.glass, borderRadius: 32, marginBottom: 20, boxShadow: T.shadow, border: T.border }}>
                    <h2 style={{ fontSize: pricing.finalPrice > 0 ? 72 : 48, margin: 0, color: T.t1, letterSpacing: -2 }}>
                      {pricing.finalPrice > 0 ? `${pricing.finalPrice}€` : 'Sur devis'}
                    </h2>
                    <p style={{ color: T.accent, fontWeight: 600, marginTop: 8 }}>
                      {pricing.finalPrice > 0 ? 'Paiement immédiat en boutique' : 'Évaluation personnalisée en magasin'}
                    </p>
                  </div>
                  {pricing.finalPrice > 0 && <PricingSummary pricing={pricing} condition={condition || 'bon'} />}
                  <button onClick={() => setDone(true)} style={{ width: '100%', padding: 18, marginTop: 24, borderRadius: 20, border: 'none', background: T.t1, color: '#fff', fontWeight: 600, fontSize: 16 }}>
                    {pricing.finalPrice > 0 ? "Accepter l'offre" : "Demander une évaluation"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
