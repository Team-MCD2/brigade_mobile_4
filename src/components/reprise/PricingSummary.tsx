import { motion } from 'framer-motion';
import type { PricingResult } from '../../utils/pricing';

const T = {
  accent: '#6366f1',
  accentSoft: 'rgba(99,102,241,0.08)',
  green: '#22c55e',
  greenSoft: 'rgba(34,197,94,0.08)',
  red: '#ef4444',
  amber: '#f59e0b',
  t1: '#f5f5f5',
  t2: '#a3a3a3',
  t3: '#666666',
  border: '#222222',
  surface: '#111111',
};

interface PricingSummaryProps {
  pricing: PricingResult;
  condition: string;
}

export default function PricingSummary({ pricing, condition }: PricingSummaryProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* MARKET INTELLIGENCE */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <MiniStat label={pricing.coefficients.demand.label} value={`×${pricing.coefficients.demand.value.toFixed(2)}`} color={pricing.coefficients.demand.value >= 1 ? T.green : T.red} />
        <MiniStat label={pricing.coefficients.age.label} value={`×${pricing.coefficients.age.value.toFixed(2)}`} color={pricing.coefficients.age.value >= 0.95 ? T.green : T.amber} />
        <MiniStat label={pricing.coefficients.storage.label} value={`×${pricing.coefficients.storage.value.toFixed(2)}`} color={pricing.coefficients.storage.value >= 1 ? T.green : T.t3} />
      </motion.div>

      {/* BREAKDOWN */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 24 }}>
        <h3 style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: T.t3, marginBottom: 16 }}>Détail du calcul</h3>
        <Row left="Prix marché (neuf)" right={`${pricing.marketPrice}€`} color={T.t1} />
        <Row left="Prix ajusté (marché)" right={`${pricing.adjustedMarketPrice}€`} color={T.accent} />
        <Row left="Valeur revente future" right={`${pricing.futureResaleValue}€`} color={T.accent} />
        <Row left={`Décote état (${condition})`} right={`-${pricing.conditionDeduction}€`} color={T.amber} />
        {pricing.defectDeductions.map((d, i) => <Row key={i} left={d.label} right={`-${d.amount}€`} color={T.red} />)}
        <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 12, paddingTop: 12 }}>
          <Row left="Décote totale" right={`-${pricing.totalDecote}€`} color={T.red} bold />
        </div>
      </motion.div>

      {/* OPERATIONAL COSTS */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 24 }}>
        <h3 style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: T.t3, marginBottom: 16 }}>Coûts opérationnels</h3>
        <Row left="📦 Logistique" right={`-${pricing.operationalCosts.logistics}€`} color={T.t2} />
        <Row left="🔍 Inspection" right={`-${pricing.operationalCosts.inspection}€`} color={T.t2} />
        <Row left="🛡️ SAV / Garantie" right={`-${pricing.operationalCosts.sav}€`} color={T.t2} />
        <Row left="🔧 Réparation estimée" right={`-${pricing.operationalCosts.repair}€`} color={pricing.operationalCosts.repair > 0 ? T.amber : T.t3} />
        <Row left="⚠️ Risque fraude" right={`-${pricing.operationalCosts.fraudRisk}€`} color={T.t2} />
        <Row left="📉 Dépréciation marché" right={`-${pricing.operationalCosts.marketDepreciation}€`} color={T.amber} />
        {pricing.operationalCosts.aiDecote > 0 && <Row left="🤖 Décote IA" right={`-${pricing.operationalCosts.aiDecote}€`} color={T.accent} />}
        <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 12, paddingTop: 12 }}>
          <Row left="Total coûts" right={`-${pricing.operationalCosts.total}€`} color={T.red} bold />
        </div>
      </motion.div>

      {/* FUTURE PREDICTION CHART (Simulated with CSS) */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
        style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 24 }}>
        <h3 style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: T.t3, marginBottom: 16 }}>Évolution prévue du prix</h3>
        <div style={{ position: 'relative', height: 60, display: 'flex', alignItems: 'flex-end', gap: 8, paddingBottom: 20 }}>
          {[1, 0.95, 0.90, 0.85, 0.80].map((scale, i) => (
            <div key={i} style={{ flex: 1, height: `${scale * 100}%`, background: i === 0 ? T.accent : 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
              <span style={{ position: 'absolute', bottom: -18, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: T.t3 }}>M+{i}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: T.t3, margin: '12px 0 0', lineHeight: 1.4 }}>
          L'IA estime une baisse de <span style={{ color: T.amber }}>{(pricing.operationalCosts.marketDepreciation / pricing.adjustedMarketPrice * 100).toFixed(1)}%</span> par mois. Revendre aujourd'hui vous garantit le meilleur prix.
        </p>
      </motion.div>

      {/* FINAL PRICE + MARGIN */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ 
          background: pricing.profitability.level === 'loss' ? 'rgba(239, 68, 68, 0.1)' : T.surface, 
          borderRadius: 16, 
          border: `1px solid ${pricing.profitability.level === 'loss' ? T.red : T.border}`, 
          padding: 24, 
          marginBottom: 24 
        }}>
        {pricing.profitability.level === 'loss' ? (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <h4 style={{ color: T.red, margin: '8px 0', fontSize: 16 }}>Offre non disponible</h4>
            <p style={{ fontSize: 13, color: T.t2, margin: 0 }}>Désolé, les coûts de remise en état dépassent la valeur de l'appareil. Nous ne pouvons pas faire d'offre de reprise rentable.</p>
          </div>
        ) : (
          <>
            <Row left="Marge minimum (200€)" right={`${pricing.margin}€`} color={T.amber} />
            <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>
              <span>Offre finale</span>
              <span style={{ color: T.green }}>{pricing.finalPrice}€</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 100 }}>
      <span style={{ fontSize: 10, color: T.t3, display: 'block', textTransform: 'uppercase', marginBottom: 2 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 800, color }}>{value}</span>
    </div>
  );
}

function Row({ left, right, color, bold }: { left: string; right: string; color?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: bold ? 700 : 400 }}>
      <span style={{ color: T.t2 }}>{left}</span>
      <span style={{ color: color || T.t1 }}>{right}</span>
    </div>
  );
}
