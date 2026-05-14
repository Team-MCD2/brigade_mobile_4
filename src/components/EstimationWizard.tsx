import React, { useState } from 'react';
import { brands, calculateOffer, BRIGADE_MARGIN, MIN_OFFER } from '../data/phonePricing';

type Step = 'brands' | 'models' | 'storage' | 'custom' | 'screen' | 'body' | 'result';

/* ── Custom phone pricing ─────────────────────────────────── */
const PRICE_RANGE_MARKET: Record<string, number> = {
  'under200': 85,
  '200-400':  175,
  '400-650':  320,
  '650-900':  490,
  'over900':  700,
};
const AGE_COEFF: Record<string, number> = {
  '2025': 0.90, '2024': 0.78, '2023': 0.63,
  '2022': 0.50, '2021': 0.40, '2020': 0.30, 'older': 0.22,
};
function computeCustomOffer(
  priceRange: string, year: string,
  screen: string, body: string, battery: string,
  functional: boolean, unlocked: boolean,
): number {
  const market = Math.round((PRICE_RANGE_MARKET[priceRange] ?? 200) * (AGE_COEFF[year] ?? 0.4));
  const deductions = 
    ({ perfect:0, good:20, fair:55, poor:100 }[screen] ?? 0) +
    ({ perfect:0, good:10, fair:35, poor:65  }[body]   ?? 0) +
    ({ good:0, degraded:25, bad:45            }[battery] ?? 0) +
    (functional ? 0 : 60) + (unlocked ? 0 : 30);
  return Math.max(market - BRIGADE_MARGIN - deductions, MIN_OFFER);
}

interface ConditionOption { id: string; label: string; desc: string; icon: string; }

const SCREEN_OPTIONS: ConditionOption[] = [
  { id: 'perfect', label: 'Parfait',        desc: 'Aucune rayure, comme neuf',          icon: '✦' },
  { id: 'good',    label: 'Bon état',        desc: "Légères rayures, invisible à l'allumé",  icon: '◈' },
  { id: 'fair',    label: 'Usé',             desc: 'Rayures visibles, pas de fissures',  icon: '◇' },
  { id: 'poor',    label: 'Endommagé',       desc: 'Écran fissuré ou cassé',             icon: '✕' },
];

const BODY_OPTIONS: ConditionOption[] = [
  { id: 'perfect', label: 'Parfait',        desc: 'Aucune marque, aucun choc',          icon: '✦' },
  { id: 'good',    label: 'Bon état',        desc: "Légères traces d'utilisation",        icon: '◈' },
  { id: 'fair',    label: 'Usé',             desc: 'Bosses ou rayures visibles',         icon: '◇' },
  { id: 'poor',    label: 'Très abîmé',      desc: 'Dos cassé ou structure déformée',    icon: '✕' },
];

const BATTERY_OPTIONS: ConditionOption[] = [
  { id: 'good',      label: '≥ 80%',    desc: 'Autonomie correcte au quotidien',       icon: '🔋' },
  { id: 'degraded',  label: '60–80%',   desc: 'Autonomie réduite, tient la journée',   icon: '🔋' },
  { id: 'bad',       label: '< 60%',    desc: 'Batterie faible ou gonflement',         icon: '🔋' },
];

const STEP_LABELS = ['Marque', 'Modèle', 'Stockage', 'Écran', 'Appareil', 'Résultat'];
const STEP_KEYS: Step[] = ['brands', 'models', 'storage', 'screen', 'body', 'result'];

const s = {
  overlay: {
    position: 'fixed' as const, inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  } as React.CSSProperties,
  modal: {
    background: '#fff', borderRadius: '20px',
    width: '100%', maxWidth: '640px', maxHeight: '90vh',
    display: 'flex', flexDirection: 'column' as const,
    boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
  },
  modalHeader: {
    padding: '1.5rem 1.5rem 0',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '1rem',
  },
  progressRow: {
    display: 'flex', gap: '6px', marginBottom: '1rem',
  },
  progressStep: (active: boolean, done: boolean): React.CSSProperties => ({
    flex: 1, height: '3px', borderRadius: '2px',
    background: done ? '#c94f00' : active ? '#1d1d1f' : '#e5e5e5',
    transition: 'background 0.3s',
  }),
  stepTitle: {
    fontSize: '1.15rem', fontWeight: 700, color: '#1d1d1f', margin: 0,
  },
  stepSub: {
    fontSize: '0.85rem', color: '#6e6e73', marginTop: '2px',
  },
  body: {
    padding: '1.25rem 1.5rem', overflowY: 'auto' as const, flex: 1,
  },
  grid2: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
  },
  grid3: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem',
  },
  optionBtn: (selected: boolean): React.CSSProperties => ({
    padding: '0.85rem 1rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
    border: `1.5px solid ${selected ? '#c94f00' : '#e5e5e5'}`,
    background: selected ? '#fff4ec' : '#fafafa',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  }),
  optionLabel: { fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1f', display: 'block' },
  optionDesc:  { fontSize: '0.75rem', color: '#6e6e73', marginTop: '2px', display: 'block' },
  storageBtn: (selected: boolean): React.CSSProperties => ({
    padding: '0.75rem', borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
    border: `1.5px solid ${selected ? '#c94f00' : '#e5e5e5'}`,
    background: selected ? '#fff4ec' : '#fafafa',
    fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1f',
    transition: 'all 0.15s ease',
  }),
  modelBtn: (selected: boolean): React.CSSProperties => ({
    padding: '0.75rem 1rem', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
    border: `1.5px solid ${selected ? '#c94f00' : '#e5e5e5'}`,
    background: selected ? '#fff4ec' : '#fafafa',
    fontSize: '0.875rem', fontWeight: 500, color: '#1d1d1f',
    transition: 'all 0.15s ease',
  }),
  footer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #f0f0f0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    gap: '0.75rem',
  },
  btnBack: {
    padding: '0.7rem 1.25rem', borderRadius: '10px',
    background: '#f5f5f7', border: 'none', cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: 500, color: '#1d1d1f',
  },
  btnNext: (disabled: boolean): React.CSSProperties => ({
    padding: '0.7rem 1.75rem', borderRadius: '10px',
    background: disabled ? '#e5e5e5' : '#1d1d1f', border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '0.9rem', fontWeight: 600, color: disabled ? '#aaa' : '#fff',
    transition: 'background 0.2s',
    flex: 1, maxWidth: '200px',
  }),
  resultBox: {
    background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)',
    borderRadius: '16px', padding: '2rem', textAlign: 'center' as const, color: '#fff',
    marginBottom: '1rem',
  },
  resultPrice: {
    fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em',
    color: '#fff', margin: '0.5rem 0',
  },
  resultAccent: { color: '#c94f00' },
  disclaimer: {
    fontSize: '0.75rem', color: '#9a9a9a', textAlign: 'center' as const, lineHeight: 1.5,
    padding: '0 0.5rem',
  },
  brandCard: (selected: boolean): React.CSSProperties => ({
    borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
    border: `2px solid ${selected ? '#c94f00' : 'transparent'}`,
    transition: 'all 0.18s ease',
    background: '#fafafa',
    boxShadow: selected ? '0 0 0 3px rgba(201,79,0,0.15)' : '0 2px 8px rgba(0,0,0,0.07)',
  }),
  sectionLabel: {
    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em',
    textTransform: 'uppercase' as const, color: '#9a9a9a', marginBottom: '0.75rem',
    display: 'block',
  },
  checkRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0',
  },
  toggle: (on: boolean): React.CSSProperties => ({
    width: '44px', height: '26px', borderRadius: '13px',
    background: on ? '#c94f00' : '#d1d1d6',
    position: 'relative', cursor: 'pointer', transition: 'background 0.2s', border: 'none',
    flexShrink: 0,
  }),
  toggleKnob: (on: boolean): React.CSSProperties => ({
    position: 'absolute', top: '3px',
    left: on ? '21px' : '3px',
    width: '20px', height: '20px', borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    transition: 'left 0.2s',
  }),
};

export default function EstimationWizard() {
  const [step, setStep] = useState<Step>('brands');
  const [brandId, setBrandId]   = useState<string | null>(null);
  const [modelId, setModelId]   = useState<string | null>(null);
  const [storage, setStorage]   = useState<string | null>(null);
  const [screen,  setScreen]    = useState<string | null>(null);
  const [body,    setBody]       = useState<string | null>(null);
  const [battery, setBattery]   = useState<string>('good');
  const [functional, setFunctional] = useState<boolean>(true);
  const [open, setOpen]         = useState(false);

  /* ── Custom phone state ── */
  const [customBrand,    setCustomBrand]    = useState('');
  const [customModel,    setCustomModel]    = useState('');
  const [customYear,     setCustomYear]     = useState('');
  const [customRange,    setCustomRange]    = useState('');
  const [customStorage,  setCustomStorage]  = useState('');
  const [customUnlocked, setCustomUnlocked] = useState(true);
  const [customImei,     setCustomImei]     = useState('');

  const isCustom = brandId === 'autre';
  const brand     = brands.find(b => b.id === brandId);
  const model     = brand?.models.find(m => m.id === modelId);
  const storageOpt = model?.storages.find(st => st.capacity === storage);

  const currentKeys: Step[] = isCustom
    ? ['brands', 'custom', 'screen', 'body', 'result']
    : ['brands', 'models', 'storage', 'screen', 'body', 'result'];
  const stepIdx = currentKeys.indexOf(step);

  const offer = (step === 'result' && screen && body)
    ? isCustom && customRange && customYear
      ? computeCustomOffer(customRange, customYear, screen, body, battery, functional, customUnlocked)
      : storageOpt ? calculateOffer(storageOpt.marketPrice, screen, body, battery, functional) : null
    : null;

  const customValid = !!customBrand.trim() && !!customModel.trim() && !!customYear && !!customRange;

  const canNext: Record<Step, boolean> = {
    brands:  !!brandId,
    models:  !!modelId,
    storage: !!storage,
    custom:  customValid,
    screen:  !!screen,
    body:    !!body,
    result:  true,
  };

  const NEXT_STEP: Record<Step, Step> = {
    brands:  isCustom ? 'custom' : 'models',
    models:  'storage',
    storage: 'screen',
    custom:  'screen',
    screen:  'body',
    body:    'result',
    result:  'result',
  };
  const PREV_STEP: Record<Step, Step | null> = {
    brands:  null,
    models:  'brands',
    storage: 'models',
    custom:  'brands',
    screen:  isCustom ? 'custom' : 'storage',
    body:    'screen',
    result:  'body',
  };

  const goNext = () => { if (canNext[step]) setStep(NEXT_STEP[step]); };
  const goBack = () => { const prev = PREV_STEP[step]; if (prev) setStep(prev); else setOpen(false); };

  const reset = () => {
    setBrandId(null); setModelId(null); setStorage(null);
    setScreen(null); setBody(null); setBattery('good'); setFunctional(true);
    setCustomBrand(''); setCustomModel(''); setCustomYear('');
    setCustomRange(''); setCustomStorage(''); setCustomUnlocked(true); setCustomImei('');
    setStep('brands'); setOpen(false);
  };

  const openForBrand = (id: string) => {
    reset();
    setBrandId(id);
    setStep(id === 'autre' ? 'custom' : 'models');
    setOpen(true);
  };

  const customSummary = isCustom ? `${customBrand} ${customModel}${customStorage ? ' · ' + customStorage : ''}` : '';

  const stepTitles: Record<Step, { title: string; sub: string }> = {
    brands:  { title: 'Votre appareil',           sub: 'Sélectionnez une marque' },
    models:  { title: 'Quel modèle ?',            sub: brand?.name ?? '' },
    storage: { title: 'Quelle capacité ?',        sub: model?.name ?? '' },
    custom:  { title: 'Décrivez votre téléphone', sub: 'Renseignez les informations clés' },
    screen:  { title: 'État de l\'écran',         sub: 'Observez votre écran attentivement' },
    body:    { title: 'État général',             sub: 'Coque, dos et structure' },
    result:  { title: 'Votre estimation',         sub: isCustom ? customSummary : `${brand?.name} · ${model?.name} · ${storage}` },
  };

  return (
    <>
      {/* ── Brand cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
        {brands.map(b => (
          <div key={b.id} style={s.brandCard(brandId === b.id)} onClick={() => openForBrand(b.id)}>
            <div style={{
              height: '200px',
              backgroundImage: "url('/phones-cards.png')",
              backgroundSize: '400% auto',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: b.id === 'apple' ? '0% 40%' : b.id === 'samsung' ? '33.33% 40%' : b.id === 'pixel' ? '66.66% 40%' : '100% 40%',
              backgroundColor: b.id === 'apple' ? '#e8e8ed' : b.id === 'samsung' ? '#2a2a2a' : b.id === 'pixel' ? '#f0ede6' : '#e8e6f0',
            }} />
            <div style={{ background: '#fff', padding: '0.9rem 1rem 1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1d1d1f' }}>{b.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#6e6e73', marginTop: '3px' }}>
                {b.id === 'apple'   && 'iPhone 11 → 15 Pro Max'}
                {b.id === 'samsung' && 'Galaxy S21 → S24 Ultra'}
                {b.id === 'pixel'   && 'Pixel 6 → 9 Pro XL'}
                {b.id === 'autre'   && 'OnePlus, Xiaomi, OPPO…'}
              </div>
              <div style={{
                display: 'inline-block', marginTop: '0.6rem',
                fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                borderRadius: '2rem', background: '#fff4ec', color: '#c94f00',
              }}>Estimation immédiate</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Wizard overlay ── */}
      {open && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) reset(); }}>
          <div style={s.modal}>

            {/* Header */}
            <div style={s.modalHeader}>
              <div style={s.progressRow}>
                {currentKeys.map((k, i) => (
                  <div key={k} style={s.progressStep(i === stepIdx, i < stepIdx)} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={s.stepTitle}>{stepTitles[step].title}</p>
                  <p style={s.stepSub}>{stepTitles[step].sub}</p>
                </div>
                <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#9a9a9a', padding: '0 0 0 1rem' }}>✕</button>
              </div>
            </div>

            {/* Body */}
            <div style={s.body}>

              {/* STEP: brands */}
              {step === 'brands' && (
                <div style={s.grid2}>
                  {brands.map(b => (
                    <div key={b.id} style={s.optionBtn(brandId === b.id)} onClick={() => setBrandId(b.id)}>
                      <span style={s.optionLabel}>{b.name}</span>
                      <span style={s.optionDesc}>{b.id === 'apple' ? 'iPhone 11 → 15 Pro Max' : b.id === 'samsung' ? 'Galaxy S21 → S24 Ultra' : b.id === 'pixel' ? 'Pixel 6 → 9 Pro XL' : 'OnePlus, Xiaomi, OPPO…'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP: models */}
              {step === 'models' && brand && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {brand.models.map(m => (
                    <div key={m.id} style={s.modelBtn(modelId === m.id)} onClick={() => setModelId(m.id)}>
                      {m.name}
                    </div>
                  ))}
                </div>
              )}

              {/* STEP: storage */}
              {step === 'storage' && model && (
                <div style={s.grid3}>
                  {model.storages.map(opt => (
                    <div key={opt.capacity} style={s.storageBtn(storage === opt.capacity)} onClick={() => setStorage(opt.capacity)}>
                      {opt.capacity}
                    </div>
                  ))}
                </div>
              )}

              {/* STEP: custom (Autre modèle) */}
              {step === 'custom' && (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>

                  {/* Brand + Model */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6e6e73', display: 'block', marginBottom: '0.35rem' }}>Marque *</label>
                      <input
                        type="text" value={customBrand} onChange={e => setCustomBrand(e.target.value)}
                        placeholder="Ex : OnePlus, Xiaomi…"
                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #e5e5e5', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' as const }}
                        onFocus={e => e.target.style.borderColor = '#c94f00'}
                        onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6e6e73', display: 'block', marginBottom: '0.35rem' }}>Modèle *</label>
                      <input
                        type="text" value={customModel} onChange={e => setCustomModel(e.target.value)}
                        placeholder="Ex : Redmi Note 13 Pro"
                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #e5e5e5', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' as const }}
                        onFocus={e => e.target.style.borderColor = '#c94f00'}
                        onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                      />
                    </div>
                  </div>

                  {/* Year + Price range */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6e6e73', display: 'block', marginBottom: '0.35rem' }}>Année d'achat *</label>
                      <select value={customYear} onChange={e => setCustomYear(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #e5e5e5', fontSize: '0.875rem', background: '#fff', cursor: 'pointer' }}>
                        <option value="">Sélectionner…</option>
                        {['2025','2024','2023','2022','2021','2020'].map(y => <option key={y} value={y}>{y}</option>)}
                        <option value="older">Avant 2020</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6e6e73', display: 'block', marginBottom: '0.35rem' }}>Prix neuf *</label>
                      <select value={customRange} onChange={e => setCustomRange(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #e5e5e5', fontSize: '0.875rem', background: '#fff', cursor: 'pointer' }}>
                        <option value="">Sélectionner…</option>
                        <option value="under200">Moins de 200 €</option>
                        <option value="200-400">200 € – 400 €</option>
                        <option value="400-650">400 € – 650 €</option>
                        <option value="650-900">650 € – 900 €</option>
                        <option value="over900">Plus de 900 €</option>
                      </select>
                    </div>
                  </div>

                  {/* Storage + IMEI */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6e6e73', display: 'block', marginBottom: '0.35rem' }}>Stockage</label>
                      <select value={customStorage} onChange={e => setCustomStorage(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #e5e5e5', fontSize: '0.875rem', background: '#fff', cursor: 'pointer' }}>
                        <option value="">Non renseigné</option>
                        {['64 Go','128 Go','256 Go','512 Go','1 To'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6e6e73', display: 'block', marginBottom: '0.35rem' }}>IMEI <span style={{ fontWeight: 400, color: '#aaa' }}>(optionnel)</span></label>
                      <input
                        type="text" value={customImei} onChange={e => setCustomImei(e.target.value)}
                        placeholder="*#06# pour l'obtenir"
                        maxLength={15}
                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #e5e5e5', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' as const }}
                        onFocus={e => e.target.style.borderColor = '#c94f00'}
                        onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                      />
                    </div>
                  </div>

                  {/* Unlocked toggle */}
                  <div style={{ ...s.checkRow, borderBottom: 'none', paddingTop: '0.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1f' }}>Téléphone déverrouillé opérateur</div>
                      <div style={{ fontSize: '0.78rem', color: '#6e6e73' }}>Non déverrouillé = -30 € sur l'estimation</div>
                    </div>
                    <button style={s.toggle(customUnlocked)} onClick={() => setCustomUnlocked(!customUnlocked)}>
                      <div style={s.toggleKnob(customUnlocked)} />
                    </button>
                  </div>

                  {/* Helper note */}
                  <div style={{ background: '#f5f5f7', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.55 }}>
                    💡 <strong style={{ color: '#1d1d1f' }}>Astuce :</strong> L'estimation sera plus précise si vous renseignez l'IMEI. Tapez <code style={{ background: '#e5e5e5', padding: '1px 4px', borderRadius: '4px' }}>*#06#</code> sur votre téléphone pour l'obtenir.
                  </div>
                </div>
              )}

              {/* STEP: screen */}
              {step === 'screen' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {SCREEN_OPTIONS.map(o => (
                    <div key={o.id} style={s.optionBtn(screen === o.id)} onClick={() => setScreen(o.id)}>
                      <span style={s.optionLabel}>{o.icon} {o.label}</span>
                      <span style={s.optionDesc}>{o.desc}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP: body */}
              {step === 'body' && (
                <>
                  <span style={s.sectionLabel}>État du boîtier</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {BODY_OPTIONS.map(o => (
                      <div key={o.id} style={s.optionBtn(body === o.id)} onClick={() => setBody(o.id)}>
                        <span style={s.optionLabel}>{o.icon} {o.label}</span>
                        <span style={s.optionDesc}>{o.desc}</span>
                      </div>
                    ))}
                  </div>

                  <span style={s.sectionLabel}>Autonomie batterie</span>
                  <div style={s.grid3}>
                    {BATTERY_OPTIONS.map(o => (
                      <div key={o.id} style={s.storageBtn(battery === o.id)} onClick={() => setBattery(o.id)}>
                        <div>{o.label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6e6e73', marginTop: '2px', fontWeight: 400 }}>{o.desc.split(',')[0]}</div>
                      </div>
                    ))}
                  </div>

                  <div style={s.checkRow}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1f' }}>Toutes les fonctions marchent</div>
                      <div style={{ fontSize: '0.78rem', color: '#6e6e73' }}>Appels, appareil photo, boutons, Wi-Fi…</div>
                    </div>
                    <button style={s.toggle(functional)} onClick={() => setFunctional(!functional)}>
                      <div style={s.toggleKnob(functional)} />
                    </button>
                  </div>
                </>
              )}

              {/* STEP: result */}
              {step === 'result' && offer !== null && (
                <>
                  <div style={s.resultBox}>
                    <div style={{ fontSize: '0.8rem', color: '#9a9a9a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Votre estimation</div>
                    <div style={s.resultPrice}>{offer}<span style={{ fontSize: '2rem', ...s.resultAccent }}> €</span></div>
                    <div style={{ fontSize: '0.85rem', color: '#c5c5c5' }}>
                      {model?.name} · {storage} · {screen === 'perfect' ? 'Parfait état' : screen === 'good' ? 'Bon état' : screen === 'fair' ? 'État correct' : 'Endommagé'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, background: '#f5f5f7', borderRadius: '12px', padding: '0.9rem 1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6e6e73' }}>Validité</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1d1d1f' }}>7 jours</div>
                    </div>
                    <div style={{ flex: 1, background: '#f5f5f7', borderRadius: '12px', padding: '0.9rem 1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6e6e73' }}>Paiement</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1d1d1f' }}>Jour J</div>
                    </div>
                    <div style={{ flex: 1, background: '#f5f5f7', borderRadius: '12px', padding: '0.9rem 1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6e6e73' }}>Vérification</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1d1d1f' }}>En boutique</div>
                    </div>
                  </div>

                  <div style={{ background: '#fff4ec', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#c94f00', fontWeight: 600, marginBottom: '2px' }}>📍 Brigade Mobile · Toulouse</div>
                    <div style={{ fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.5 }}>
                      Venez avec votre téléphone déverrouillé et votre pièce d'identité. Le prix final sera confirmé après inspection physique.
                    </div>
                  </div>

                  <p style={s.disclaimer}>
                    Prix indicatif établi par notre moteur de valorisation. Soumis à vérification IMEI et contrôle technique en boutique. Offre non contractuelle.
                  </p>
                </>
              )}

            </div>

            {/* Footer */}
            <div style={s.footer}>
              <button style={s.btnBack} onClick={goBack}>
                {step === 'brands' ? 'Fermer' : '← Retour'}
              </button>
              {step !== 'result' ? (
                <button style={s.btnNext(!canNext[step])} onClick={goNext} disabled={!canNext[step]}>
                  Continuer →
                </button>
              ) : (
                <button style={{ ...s.btnNext(false), background: '#c94f00' }} onClick={reset}>
                  Nouvelle estimation
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
