import React, { useState, useEffect } from 'react';
import type { AdminRequest } from '../data/adminRequests';

const STATUS_COLORS: Record<string, string> = {
  pending: 'pending',
  review:  'review',
  done:    'done',
  refused: 'refused',
};

const COND_COLOR: Record<string, string> = {
  'Parfait état':   '#22c55e',
  'Très bon état':  '#86efac',
  'Bon état':       '#facc15',
  'État moyen':     '#f97316',
  'Mauvais état':   '#ef4444',
};

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function CondBadge({ value }: { value: string }) {
  return (
    <span style={{ color: COND_COLOR[value] ?? '#888', fontWeight: 600, fontSize: '0.82rem' }}>
      {value}
    </span>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="dp-row">
      <span className="dp-row-label">{label}</span>
      <span className="dp-row-value">{children}</span>
    </div>
  );
}

export default function DetailPanel() {
  const [req, setReq] = useState<AdminRequest | null>(null);

  useEffect(() => {
    const handler = (e: Event) => setReq((e as CustomEvent<AdminRequest | null>).detail);
    window.addEventListener('req-select', handler);
    return () => window.removeEventListener('req-select', handler);
  }, []);

  /* ── Empty state ── */
  if (!req) {
    return (
      <main className="detail">
        <div className="detail-toolbar">
          <span className="toolbar-crumb">Reprises</span>
        </div>
        <div className="dp-empty">
          <div className="dp-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <p className="dp-empty-title">Aucune demande sélectionnée</p>
          <p className="dp-empty-sub">Cliquez sur une demande dans la liste pour afficher son détail.</p>
        </div>
      </main>
    );
  }

  /* ── Detail ── */
  return (
    <main className="detail">

      {/* Toolbar */}
      <div className="detail-toolbar">
        <span className="toolbar-crumb">Reprises</span>
        <span className="toolbar-sep">›</span>
        <span className="toolbar-crumb" style={{ color: 'var(--text)' }}>{req.name}</span>
        <div style={{ flex: 1 }} />
        <span className={`status-pill ${STATUS_COLORS[req.status]}`}>{req.statusLabel}</span>
      </div>

      <div className="dp-scroll">

        {/* ── Hero ── */}
        <div className="dp-hero">
          <div className={`dp-phone-img dp-phone-img--${req.brand}`} />

          <div className="dp-hero-info">
            <p className="dp-hero-brand">
              {req.brand === 'apple' ? 'Apple' : req.brand === 'samsung' ? 'Samsung' : req.brand === 'pixel' ? 'Google' : 'Autre marque'}
            </p>

            <h2 className="dp-phone-name">{req.name}</h2>

            <div className="dp-hero-rule" />

            <div className="dp-price-block">
              <p className="dp-price">{req.price}</p>
              <p className="dp-price-caption">Estimation proposée</p>
            </div>

            <p className="dp-hero-meta">{req.storage} &middot; {req.date}</p>
          </div>
        </div>

        {/* ── État de l'appareil ── */}
        <div className="dp-section">
          <p className="dp-section-title">État de l'appareil</p>
          <div className="dp-grid-2">
            <Row label="Écran"><CondBadge value={req.screen} /></Row>
            <Row label="Boîtier"><CondBadge value={req.body} /></Row>
            <Row label="Batterie">
              <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text)' }}>{req.battery}</span>
            </Row>
            <Row label="Fonctionnel">
              <span style={{ fontWeight: 600, fontSize: '0.82rem', color: req.functional ? '#22c55e' : '#ef4444' }}>
                {req.functional ? 'Oui' : 'Non'}
              </span>
            </Row>
            <Row label="Déverrouillé">
              <span style={{ fontWeight: 600, fontSize: '0.82rem', color: req.unlocked ? '#22c55e' : '#f97316' }}>
                {req.unlocked ? 'Oui' : 'Non'}
              </span>
            </Row>
            {req.imei && (
              <Row label="IMEI">
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.04em' }}>
                  {req.imei}
                </span>
              </Row>
            )}
          </div>
        </div>

        {/* ── Coordonnées client ── */}
        <div className="dp-section">
          <p className="dp-section-title">Coordonnées client</p>
          <div className="dp-client-card">
            <div className="dp-avatar">{initials(req.client.name)}</div>
            <div className="dp-client-info">
              <p className="dp-client-name">{req.client.name}</p>
              <p className="dp-client-contact">{req.client.email} · {req.client.phone}</p>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="dp-section">
          <p className="dp-section-title">Actions</p>
          <div className="dp-actions">
            <button className="dp-btn dp-btn--validate">Valider l'offre</button>
            <button className="dp-btn dp-btn--contact">Contacter</button>
            <button className="dp-btn dp-btn--refuse">Refuser</button>
          </div>
        </div>

      </div>
    </main>
  );
}
