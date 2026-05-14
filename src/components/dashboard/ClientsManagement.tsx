import React from 'react';
import { motion } from 'framer-motion';
import type { DeviceRequest } from './types';

interface Props {
  requests: DeviceRequest[];
}

export default function ClientsManagement({ requests }: Props) {
  // Extract unique clients
  const clientsMap = new Map();
  requests.forEach(r => {
    if (!clientsMap.has(r.client.email)) {
      clientsMap.set(r.client.email, {
        ...r.client,
        requestsCount: 1,
        totalEstimated: r.estimatedPrice,
        lastDate: r.date
      });
    } else {
      const c = clientsMap.get(r.client.email);
      c.requestsCount += 1;
      c.totalEstimated += r.estimatedPrice;
    }
  });

  const clients = Array.from(clientsMap.values());

  return (
    <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Clients</h1>
          <p style={{ color: 'var(--db-text3)', fontSize: '0.9rem' }}>Gérez votre base de données clients et leur historique.</p>
        </div>
        <button style={{ background: 'var(--db-accent)', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
          Exporter la liste
        </button>
      </div>

      <div style={{ background: 'var(--db-surface)', borderRadius: '24px', border: '1px solid var(--db-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--db-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)', textTransform: 'uppercase' }}>Client</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)', textTransform: 'uppercase' }}>Contact</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)', textTransform: 'uppercase' }}>Localisation</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)', textTransform: 'uppercase' }}>Demandes</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)', textTransform: 'uppercase' }}>Total Estimé</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--db-text3)', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, i) => (
              <motion.tr 
                key={client.email}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderBottom: '1px solid var(--db-border)', transition: 'background 0.2s' }}
                className="client-row"
              >
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                      {client.initials}
                    </div>
                    <div style={{ fontWeight: 600 }}>{client.name}</div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem' }}>{client.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--db-text3)' }}>{client.phone}</div>
                </td>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem' }}>{client.city}</td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.6rem', borderRadius: '2rem', fontSize: '0.75rem' }}>
                    {client.requestsCount}
                  </span>
                </td>
                <td style={{ padding: '1.25rem', fontWeight: 700, color: 'var(--db-accent)' }}>
                  {client.totalEstimated.toLocaleString('fr-FR')} €
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--db-text3)', cursor: 'pointer', padding: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
