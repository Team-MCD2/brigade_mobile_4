import React from 'react';
import { motion } from 'framer-motion';
import type { DashboardSettings } from './types';

interface Props {
  settings: DashboardSettings;
  onUpdate: (s: DashboardSettings) => void;
}

export default function SettingsPanel({ settings, onUpdate }: Props) {
  const handleChange = (key: keyof DashboardSettings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}
    >
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Paramètres</h1>
        <p style={{ color: 'var(--db-text3)', fontSize: '0.9rem' }}>Configurez votre plateforme et vos préférences de rachat.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Profile / Shop */}
        <section style={s.section}>
          <h3 style={s.sectionTitle}>Boutique & Profil</h3>
          <div style={s.field}>
            <label style={s.label}>Nom de l'établissement</label>
            <input 
              style={s.input} 
              value={settings.shopName} 
              onChange={e => handleChange('shopName', e.target.value)} 
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email administrateur</label>
            <input 
              style={s.input} 
              value={settings.adminEmail} 
              onChange={e => handleChange('adminEmail', e.target.value)} 
            />
          </div>
        </section>

        {/* Business Logic */}
        <section style={s.section}>
          <h3 style={s.sectionTitle}>Logique de rachat</h3>
          <div style={s.field}>
            <label style={s.label}>Marge Brigade Mobile (%)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="range" min="5" max="40" step="1"
                style={{ flex: 1, accentColor: 'var(--db-accent)' }} 
                value={settings.margin} 
                onChange={e => handleChange('margin', parseInt(e.target.value))} 
              />
              <span style={{ fontWeight: 700, width: '40px' }}>{settings.margin}%</span>
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Offre minimum (€)</label>
            <input 
              type="number"
              style={s.input} 
              value={settings.minOffer} 
              onChange={e => handleChange('minOffer', parseInt(e.target.value))} 
            />
          </div>
          <div style={{ ...s.field, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Validation automatique</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--db-text3)' }}>Accepter les demandes parfaites sans revue</div>
            </div>
            <button 
              onClick={() => handleChange('autoValidate', !settings.autoValidate)}
              style={{
                width: '44px', height: '24px', borderRadius: '12px',
                background: settings.autoValidate ? 'var(--db-accent)' : 'rgba(255,255,255,0.1)',
                position: 'relative', border: 'none', cursor: 'pointer', transition: '0.2s'
              }}
            >
              <div style={{
                position: 'absolute', top: '3px', left: settings.autoValidate ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: '0.2s'
              }} />
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section style={s.section}>
          <h3 style={s.sectionTitle}>Apparence</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              onClick={() => handleChange('theme', 'dark')}
              style={{ ...s.themeCard, border: settings.theme === 'dark' ? '2px solid var(--db-accent)' : '2px solid transparent' }}
            >
              <div style={{ height: '40px', background: '#000', borderRadius: '8px', marginBottom: '0.5rem' }} />
              Sombre
            </button>
            <button 
              onClick={() => handleChange('theme', 'light')}
              style={{ ...s.themeCard, border: settings.theme === 'light' ? '2px solid var(--db-accent)' : '2px solid transparent' }}
            >
              <div style={{ height: '40px', background: '#fff', borderRadius: '8px', marginBottom: '0.5rem' }} />
              Clair
            </button>
          </div>
        </section>

        {/* Info */}
        <section style={s.section}>
          <h3 style={s.sectionTitle}>Système</h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--db-text3)', lineHeight: 1.6 }}>
            Version du logiciel : v2.4.0-stable<br/>
            Dernière synchronisation : Il y a 2 minutes<br/>
            Base de données : Locale (Browser Storage)
          </div>
          <button style={{ marginTop: '1.5rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            Réinitialiser toutes les données
          </button>
        </section>
      </div>
    </motion.div>
  );
}

const s = {
  section: { background: 'var(--db-surface)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--db-border)' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--db-text)' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', marginBottom: '1.25rem' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--db-text3)' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid var(--db-border)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', outline: 'none', fontSize: '0.9rem' },
  themeCard: { background: 'rgba(255,255,255,0.03)', border: 'none', padding: '1rem', borderRadius: '16px', cursor: 'pointer', textAlign: 'center' as const, color: '#fff' }
};
