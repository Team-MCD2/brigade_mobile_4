import React from 'react';
import { motion } from 'framer-motion';
import type { DeviceRequest } from './types';

interface Props {
  requests: DeviceRequest[];
}

export default function StatisticsView({ requests }: Props) {
  const completed = requests.filter(r => r.status === 'completed');
  const totalValue = completed.reduce((acc, r) => acc + r.estimatedPrice, 0);
  
  const byBrand = requests.reduce((acc: any, r) => {
    acc[r.brand] = (acc[r.brand] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Statistiques</h1>
        <p style={{ color: 'var(--db-text3)', fontSize: '0.9rem' }}>Analysez la performance de votre activité de rachat.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard label="Taux de conversion" value="68%" sub="+5% vs mois dernier" color="#22c55e" />
        <StatCard label="Panier moyen" value={`${Math.round(totalValue / (completed.length || 1))} €`} sub="Stable" color="#3b82f6" />
        <StatCard label="Temps de traitement" value="1h 24m" sub="-12m vs mois dernier" color="#a855f7" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'var(--db-surface)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--db-border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Répartition par marque</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(byBrand).map(([brand, count]: any) => (
              <div key={brand}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ textTransform: 'capitalize' }}>{brand}</span>
                  <span style={{ fontWeight: 700 }}>{count}</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / requests.length) * 100}%` }}
                    style={{ height: '100%', background: 'var(--db-accent)' }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--db-surface)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--db-border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Objectifs mensuels</h3>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto' }}>
              <svg width="160" height="160" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" stroke="var(--db-accent)" strokeWidth="10" 
                  strokeDasharray="282" strokeDashoffset={282 - (282 * 0.75)} 
                  strokeLinecap="round" transform="rotate(-90 50 50)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>75%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--db-text3)' }}>Objectif atteint</div>
              </div>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--db-text3)' }}>
              Vous avez racheté pour <strong>{totalValue.toLocaleString('fr-FR')} €</strong> sur un objectif de 32 000 €.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: any) {
  return (
    <div style={{ background: 'var(--db-surface)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--db-border)' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--db-text3)', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color, marginTop: '0.5rem', fontWeight: 600 }}>{sub}</div>
    </div>
  );
}
