import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from './mockData';
import type { DeviceRequest } from './types';

interface Props {
  requests: DeviceRequest[];
}

export default function Overview({ requests }: Props) {
  const totalValue = requests.reduce((acc, r) => acc + (r.status === 'completed' ? r.estimatedPrice : 0), 0);
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress' || r.status === 'offer_sent').length;

  const cards = [
    { label: 'Chiffre d\'affaires', value: `${totalValue.toLocaleString('fr-FR')} €`, sub: '+12.4% ce mois', icon: <IconMoney />, color: 'var(--db-accent)' },
    { label: 'Demandes en attente', value: pendingCount, sub: 'À traiter rapidement', icon: <IconClock />, color: '#3b82f6' },
    { label: 'En cours', value: inProgressCount, sub: 'Suivi nécessaire', icon: <IconSync />, color: '#a855f7' },
    { label: 'Terminées', value: completedCount, sub: 'Succès total', icon: <IconCheck />, color: 'var(--db-green)' },
  ];

  return (
    <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Vue d'ensemble</h1>
        <p style={{ color: 'var(--db-text3)', fontSize: '0.9rem' }}>Bienvenue sur votre centre de pilotage Brigade Mobile.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'var(--db-surface)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid var(--db-border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--db-green)', background: 'rgba(34,197,94,0.1)', padding: '0.25rem 0.5rem', borderRadius: '2rem' }}>
                {card.sub.split(' ')[0]}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--db-text3)', marginBottom: '0.25rem' }}>{card.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{card.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--db-text3)', marginTop: '0.5rem' }}>{card.sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Activity Chart Placeholder */}
        <div style={{ background: 'var(--db-surface)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--db-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Activité des reprises</h3>
            <select style={{ background: 'none', border: 'none', color: 'var(--db-text3)', fontSize: '0.8rem', cursor: 'pointer' }}>
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div style={{ height: '260px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1rem' }}>
            {[40, 65, 45, 90, 55, 75, 60].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  style={{ width: '100%', maxWidth: '32px', background: i === 3 ? 'var(--db-accent)' : 'rgba(255,255,255,0.05)', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--db-text3)' }}>{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'var(--db-surface)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--db-border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Actions rapides</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <QuickAction icon={<IconPlus />} label="Nouvelle demande" desc="Saisie manuelle" />
            <QuickAction icon={<IconMsg />} label="Messages" desc="3 non lus" highlight />
            <QuickAction icon={<IconDownload />} label="Exporter" desc="Rapport PDF" />
            <QuickAction icon={<IconSettings />} label="Paramètres" desc="Configuration" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, desc, highlight }: any) {
  return (
    <button style={{
      width: '100%', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
      border: highlight ? '1px solid var(--db-accent)' : '1px solid transparent',
      display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', textAlign: 'left',
      transition: 'background 0.2s'
    }}>
      <div style={{ color: highlight ? 'var(--db-accent)' : 'var(--db-text2)' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--db-text3)' }}>{desc}</div>
      </div>
    </button>
  );
}

/* Icons */
function IconMoney() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>; }
function IconClock() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>; }
function IconSync() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>; }
function IconCheck() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>; }
function IconPlus() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>; }
function IconMsg() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>; }
function IconDownload() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>; }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>; }
