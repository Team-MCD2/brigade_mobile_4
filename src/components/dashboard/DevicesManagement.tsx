import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { brands } from '../../data/phonePricing';

export default function DevicesManagement() {
  const [selectedBrand, setSelectedBrand] = useState(brands[0].id);

  const brand = brands.find(b => b.id === selectedBrand);

  return (
    <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Catalogue Appareils</h1>
          <p style={{ color: 'var(--db-text3)', fontSize: '0.9rem' }}>Consultez et gérez les prix de rachat du marché.</p>
        </div>
        <button style={{ background: 'var(--db-accent)', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
          Mettre à jour les prix
        </button>
      </div>

      {/* Brand Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {brands.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBrand(b.id)}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none',
              background: selectedBrand === b.id ? 'var(--db-accent)' : 'var(--db-surface)',
              color: selectedBrand === b.id ? '#000' : '#fff',
              fontWeight: 700, cursor: 'pointer', transition: '0.2s', whiteSpace: 'nowrap'
            }}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {brand?.models.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            style={{
              background: 'var(--db-surface)', borderRadius: '20px', padding: '1.5rem',
              border: '1px solid var(--db-border)', display: 'flex', flexDirection: 'column', gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{model.name}</h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--db-text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{brand.id}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {model.storages.map(st => (
                <div key={st.capacity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--db-text2)' }}>{st.capacity}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{st.marketPrice} €</span>
                    <button style={{ background: 'none', border: 'none', color: 'var(--db-text3)', cursor: 'pointer', padding: '2px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
