import React from 'react';
import { motion } from 'framer-motion';

const NOTIFS = [
  { id: 1, type: 'request', user: 'Mathieu Laurent', text: 'a envoyé une nouvelle demande de reprise', time: 'Il y a 5 min', active: true },
  { id: 2, type: 'photo', user: 'Sophie Martin', text: 'a ajouté 4 nouvelles photos pour son S24 Ultra', time: 'Il y a 12 min', active: true },
  { id: 3, type: 'status', user: 'Thomas (Admin)', text: 'a validé l\'offre pour le iPhone 13 Pro', time: 'Il y a 1h', active: false },
  { id: 4, type: 'msg', user: 'Lucas Bernard', text: 'vous a envoyé un message', time: 'Il y a 2h', active: false },
  { id: 5, type: 'system', user: 'Serveur', text: 'Sauvegarde automatique réussie', time: 'Il y a 3h', active: false },
];

interface Props { onClose: () => void; }

export default function NotificationPanel({ onClose }: Props) {
  return (
    <motion.div 
      className="db-notif-panel"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute', top: '70px', right: '1.75rem', width: '320px',
        maxHeight: '480px', background: 'var(--db-surface)', border: '1px solid var(--db-border)',
        borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', zIndex: 100,

        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}
    >
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Notifications</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--db-text3)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
      </div>
      <div style={{ overflowY: 'auto', padding: '0.5rem' }}>
        {NOTIFS.map(n => (
          <div key={n.id} style={{ 
            padding: '0.75rem', borderRadius: '8px', marginBottom: '0.25rem',
            background: n.active ? 'rgba(245,166,35,0.05)' : 'transparent',
            display: 'flex', gap: '0.75rem', cursor: 'pointer'
          }}>
            <div style={{ 
              width: '8px', height: '8px', borderRadius: '50%', 
              background: n.active ? 'var(--db-accent)' : 'var(--db-text3)', 
              marginTop: '5px', flexShrink: 0 
            }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--db-text)' }}>
                <span style={{ fontWeight: 600 }}>{n.user}</span> {n.text}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--db-text3)', marginTop: '0.2rem' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--db-border)', textAlign: 'center' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--db-accent)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
          Tout marquer comme lu
        </button>
      </div>
    </motion.div>
  );
}
