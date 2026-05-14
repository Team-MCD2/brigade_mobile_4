import React from 'react';
import { motion } from 'framer-motion';
import type { DeviceRequest } from './types';

interface Props {
  requests: DeviceRequest[];
}

export default function PaymentsHistory({ requests }: Props) {
  const completed = requests.filter(r => r.status === 'completed');
  const totalPaid = completed.reduce((acc, r) => acc + r.estimatedPrice, 0);

  return (
    <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Paiements</h1>
          <p style={{ color: 'var(--db-text3)', fontSize: '0.9rem' }}>Suivez les sorties de trésorerie et les rachats finalisés.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--db-text3)', textTransform: 'uppercase' }}>Total décaissé</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--db-accent)' }}>{totalPaid.toLocaleString('fr-FR')} €</div>
        </div>
      </div>

      <div style={{ background: 'var(--db-surface)', borderRadius: '24px', border: '1px solid var(--db-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--db-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)' }}>DATE</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)' }}>RÉFÉRENCE</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)' }}>APPAREIL</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)' }}>CLIENT</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)' }}>MONTANT</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)' }}>MÉTHODE</th>
            </tr>
          </thead>
          <tbody>
            {completed.length > 0 ? completed.map((r, i) => (
              <motion.tr 
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderBottom: '1px solid var(--db-border)' }}
              >
                <td style={{ padding: '1.25rem', fontSize: '0.85rem' }}>{r.date}</td>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>{r.number}</td>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem' }}>{r.deviceName}</td>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem' }}>{r.client.name}</td>
                <td style={{ padding: '1.25rem', fontSize: '0.9rem', fontWeight: 700 }}>{r.estimatedPrice} €</td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Virement</span>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--db-text3)' }}>
                  Aucun paiement finalisé pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
