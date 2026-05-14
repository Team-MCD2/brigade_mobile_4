import React from 'react';
const { useState } = React;

import { motion } from 'framer-motion';
import type { DeviceRequest, TimelineEvent, Note } from './types';
import { MOCK_TIMELINE, MOCK_NOTES } from './mockData';

interface Props { 
  request: DeviceRequest; 
  notes: Note[];
  onAddNote: (note: Note) => void;
}

export default function ClientPanel({ request: r, notes, onAddNote }: Props) {
  const [noteText, setNoteText] = useState('');
  const timeline: TimelineEvent[] = MOCK_TIMELINE[r.id] ?? [];

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    onAddNote({ 
      id: Date.now().toString(), 
      text: noteText.trim(), 
      date: 'Aujourd\'hui', 
      author: 'Thomas' 
    });
    setNoteText('');
  };

  return (
    <motion.div
      key={r.id}
      className="db-client-col"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Client info */}
      <div className="db-cp-section">
        <div className="db-cp-title">Client</div>
        <div className="db-cp-avatar-row">
          <div className="db-cp-avatar">{r.client.initials}</div>
          <div>
            <div className="db-cp-name">
              {r.client.name}
              {r.client.online && <span className="db-cp-online" />}
            </div>
          </div>
        </div>
        <div className="db-cp-row">
          <span className="db-cp-row-icon"><IconMail /></span>
          <span className="db-cp-row-val">{r.client.email}</span>
        </div>
        <div className="db-cp-row">
          <span className="db-cp-row-icon"><IconPhone /></span>
          <span className="db-cp-row-val">{r.client.phone}</span>
        </div>
        <div className="db-cp-row">
          <span className="db-cp-row-icon"><IconPin /></span>
          <span className="db-cp-row-val">{r.client.city}</span>
        </div>
      </div>

      {/* Device info */}
      <div className="db-cp-section">
        <div className="db-cp-title">Informations appareil</div>
        <div className="db-device-info-grid">
          <div className="db-device-info-row">
            <span className="db-di-label">IMEI</span>
            <span className="db-di-val mono">{r.imei || 'Non renseigné'}</span>
          </div>
          <div className="db-device-info-row">
            <span className="db-di-label">Débloqué</span>
            <span className="db-di-val" style={{ color: r.unlocked ? 'var(--db-green)' : 'var(--db-amber)' }}>
              {r.unlocked ? 'Oui' : 'Non'}
            </span>
          </div>
          <div className="db-device-info-row">
            <span className="db-di-label">Garantie</span>
            <span className="db-di-val">{r.warranty ? 'Oui' : 'Non'}</span>
          </div>
          <div className="db-device-info-row">
            <span className="db-di-label">Accessoires</span>
            <span className="db-di-val">{r.accessories}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="db-cp-section">
        <div className="db-cp-title">Historique</div>
        <div className="db-timeline">
          {timeline.length > 0 ? timeline.map((ev, i) => (
            <div key={ev.id} className="db-tl-item">
              <div className="db-tl-dot-col">
                <div className={`db-tl-dot ${ev.type}`} />
                {i < timeline.length - 1 && <div className="db-tl-line" />}
              </div>
              <div>
                <div className="db-tl-label">{ev.label}</div>
                <div className="db-tl-date">{ev.date} à {ev.time}</div>
              </div>
            </div>
          )) : (
            <div style={{ fontSize: '0.72rem', color: 'var(--db-text3)', fontStyle: 'italic' }}>Aucun historique disponible</div>
          )}
        </div>
        {timeline.length > 0 && (
          <span className="db-tl-link">Voir l'historique complet</span>
        )}
      </div>

      {/* Notes */}
      <div className="db-cp-section">
        <div className="db-cp-title">Notes internes</div>
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
          {notes.map(n => (
            <div key={n.id} className="db-note-item">
              <div className="db-note-text">{n.text}</div>
              <div className="db-note-meta">{n.author} · {n.date}</div>
            </div>
          ))}
          {notes.length === 0 && (
            <div style={{ fontSize: '0.72rem', color: 'var(--db-text3)', fontStyle: 'italic', marginBottom: '1rem' }}>Aucune note pour le moment</div>
          )}
        </div>
        <textarea
          className="db-notes-area"
          placeholder="Ajouter une note..."
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          rows={3}
        />
        <button className="db-save-note-btn" onClick={handleSaveNote}>
          Enregistrer la note
        </button>
      </div>
    </motion.div>
  );
}


function IconMail() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1" y="3" width="11" height="8" rx="1.5"/><path d="M1 4l5.5 4L12 4"/></svg>;
}
function IconPhone() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 2.5A1.5 1.5 0 013.5 1h1l1 3-1.5 1a8 8 0 004 4l1-1.5 3 1v1A1.5 1.5 0 0111 11 9 9 0 012 2.5z"/></svg>;
}
function IconPin() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6.5 1a4 4 0 014 4c0 3-4 7.5-4 7.5S2.5 8 2.5 5a4 4 0 014-4z"/><circle cx="6.5" cy="5" r="1.5"/></svg>;
}
