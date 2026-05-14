import React from 'react';
import { motion } from 'framer-motion';
import type { DeviceRequest } from './types';

const STATUS_LABELS: Record<string, string> = {
  pending:     'En attente',
  in_progress: 'En cours',
  offer_sent:  'Offre envoyée',
  completed:   'Terminée',
  refused:     'Refusée',
};

interface Props {
  request: DeviceRequest;
  active: boolean;
  dimmed: boolean;
  onClick: () => void;
}

export default function RequestCard({ request: r, active, dimmed, onClick }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: dimmed ? 0.38 : 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`db-req-card${active ? ' active' : ''}${dimmed ? ' db-dimmed' : ''}`}
      onClick={onClick}
    >
      <div className="db-card-img">
        {r.imageUrl ? (
          <img src={r.imageUrl} alt={r.deviceName} loading="lazy" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: '#444' }}>
            <rect x="5" y="1" width="12" height="20" rx="3"/>
            <circle cx="11" cy="17.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        )}
      </div>

      <div className="db-card-body">
        <div className="db-card-name">{r.deviceName}</div>
        <div className="db-card-specs">{r.storage} · {r.color}</div>
        <div className="db-card-meta">
          <span className="db-card-num">{r.number}</span>
          <span style={{ margin: '0 0.3rem', opacity: 0.4 }}>·</span>
          {r.date} à {r.time}
        </div>
      </div>

      <div className="db-card-right">
        <div className="db-card-price">{r.estimatedPrice.toLocaleString('fr-FR')} €</div>
        <span className={`db-status-pill ${r.status}`}>{STATUS_LABELS[r.status]}</span>
      </div>
    </motion.div>
  );
}
