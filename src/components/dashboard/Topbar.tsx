import React, { type RefObject } from 'react';


interface Props {
  searchRef: RefObject<HTMLInputElement>;
  searchQuery: string;
  onSearch: (q: string) => void;
  onNewRequest: () => void;
  onToggleNotif: () => void;
  showNotif: boolean;
  title?: string;
  onBack?: () => void;
}

export default function Topbar({
  searchRef, searchQuery, onSearch, onNewRequest, onToggleNotif, showNotif, title, onBack
}: Props) {
  return (
    <div className="db-topbar">
      <div className="db-topbar-row1">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onBack && (
            <button 
              className="db-btn-icon back-btn-mobile" 
              onClick={onBack}
              style={{ width: '32px', height: '32px', border: 'none', background: 'rgba(255,255,255,0.05)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <div>
            <div className="db-page-title">{title || 'Demandes de reprise'}</div>
            <div className="db-page-sub desktop-only">Gérez et analysez toutes les demandes de rachat.</div>
          </div>
        </div>
        <div className="db-topbar-actions">
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem', background: 'rgba(34,197,94,0.1)', padding: '0.4rem 0.8rem', borderRadius: '2rem', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} className="pulse-slow" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sync Live</span>
          </div>
          {/* Search */}
          <div className="db-search">
            <span className="db-search-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/>
              </svg>
            </span>
            <input
              ref={searchRef}
              placeholder="Rechercher un client, appareil, IMEI..."
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
            />
            {searchQuery
              ? <button onClick={() => onSearch('')} style={{ background: 'none', border: 'none', color: 'var(--db-text3)', cursor: 'pointer', padding: 0, fontSize: '1rem', lineHeight: 1 }}>×</button>
              : <span className="db-kbd">⌘K</span>
            }
          </div>

          {/* Filter */}
          <button className="db-btn-icon desktop-only" title="Filtres" style={{ gap: '0.35rem', padding: '0 0.6rem', width: 'auto' }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h11M4 7.5h7M6 11h3"/>
            </svg>
            <span style={{ fontSize: '0.72rem', color: 'var(--db-text2)' }}>Filtres</span>
          </button>

          {/* Notifications */}
          <button
            className="db-btn-icon"
            title="Notifications"
            onClick={e => { e.stopPropagation(); onToggleNotif(); }}
            style={{ background: showNotif ? 'rgba(255,255,255,0.08)' : undefined }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7.5 1.5a4 4 0 014 4v3.5l1 1.5H2.5l1-1.5V5.5a4 4 0 014-4z"/>
              <path d="M6 11.5a1.5 1.5 0 003 0"/>
            </svg>
            <span className="db-notif-dot">8</span>
          </button>

          {/* New request */}
          <button className="db-btn-primary mobile-compact" onClick={onNewRequest}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6.5 2v9M2 6.5h9" strokeLinecap="round"/>
            </svg>
            <span className="desktop-only">Nouvelle demande</span>
          </button>

          {/* Avatar */}
          <div className="desktop-only" style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg,#f5a623,#e8941c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', fontWeight: 700, color: '#000', cursor: 'pointer', flexShrink: 0,
          }}>T</div>
        </div>
      </div>
    </div>
  );
}
