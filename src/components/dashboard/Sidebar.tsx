import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from './mockData';

function Sparkline() {
  const pts = [20, 35, 25, 45, 38, 55, 42, 60, 50, 70, 55, 75];
  const w = 160; const h = 32; const max = Math.max(...pts); const min = Math.min(...pts);
  const x = (i: number) => (i / (pts.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="db-sparkline">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f5a623" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#sg)" />
      <path d={d} fill="none" stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface Props { 
  active: string; 
  onNav: (key: string) => void; 
  requestCount: number;
  unreadCount: number;
  monthlyRevenue: number;
  shopName: string;
  onLogout: () => void;
}

export default function Sidebar({ active, onNav, requestCount, unreadCount, monthlyRevenue, shopName, onLogout }: Props) {

  const NAV = [
    { key: 'dashboard', label: 'Tableau de bord', icon: <IconGrid /> },
    { key: 'requests',  label: 'Demandes',         icon: <IconInbox />,  badge: requestCount },
    { key: 'devices',   label: 'Appareils',        icon: <IconPhone /> },
    { key: 'clients',   label: 'Clients',          icon: <IconUsers /> },
    { key: 'messages',  label: 'Messages',         icon: <IconMsg />,    badge: unreadCount, badgeBlue: true },
    { key: 'payments',  label: 'Paiements',        icon: <IconCard /> },
    { key: 'stats',     label: 'Statistiques',     icon: <IconChart /> },
    { key: 'settings',  label: 'Paramètres',       icon: <IconCog /> },
  ];

  const [firstWord, ...rest] = shopName.split(' ');

  return (
    <aside className="db-sidebar">
      {/* Logo */}
      <div className="db-sidebar-logo">
        <div className="db-logo-text">{firstWord}</div>
        <div className="db-logo-accent">{rest.join(' ').toUpperCase() || 'MOBILE'}</div>
      </div>


      {/* Nav */}
      <nav className="db-nav">
        {NAV.map(item => (
          <button
            key={item.key}
            className={`db-nav-item${active === item.key ? ' active' : ''}`}
            onClick={() => onNav(item.key)}
          >
            <span className="db-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`db-nav-badge${item.badgeBlue ? ' blue' : ''}`}>{item.badge}</span>
            )}
          </button>
        ))}
      </nav>



      {/* Stats mini */}
      <div className="db-sidebar-stats">
        <div className="db-stats-label">Reprises ce mois</div>
        <div className="db-stats-value">{STATS.monthlyRevenue.toLocaleString('fr-FR')} €</div>
        <div className="db-stats-growth">{STATS.growth} vs mois dernier</div>
        <Sparkline />
      </div>

      {/* Profile */}
      <div className="db-sidebar-profile">
        <div className="db-profile-avatar">T</div>
        <div>
          <div className="db-profile-name">Thomas</div>
          <div className="db-profile-role">Administrateur</div>
        </div>
        <svg className="db-profile-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Logout */}
      <button className="db-logout" onClick={onLogout}>
        <IconLogout />
        <span>Déconnexion</span>
      </button>

    </aside>
  );
}

/* ── Inline SVG icons ── */
function IconGrid() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>;
}
function IconInbox() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10h3l1.5 2h3L11 10h3V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7z"/></svg>;
}
function IconPhone() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="1" width="8" height="14" rx="2"/><circle cx="8" cy="12.5" r=".75" fill="currentColor" stroke="none"/></svg>;
}
function IconUsers() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="5" r="2.5"/><path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5"/><circle cx="12" cy="5" r="2"/><path d="M15 14c0-2.21-1.34-4-3-4"/></svg>;
}
function IconMsg() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 9a2 2 0 01-2 2H5l-3 3V3a2 2 0 012-2h8a2 2 0 012 2v6z"/></svg>;
}
function IconCard() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="14" height="10" rx="2"/><path d="M1 7h14"/></svg>;
}
function IconChart() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12l4-4 3 3 4-5 3 2"/></svg>;
}
function IconCog() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.1 3.1l1.1 1.1M11.8 11.8l1.1 1.1M3.1 12.9l1.1-1.1M11.8 4.2l1.1-1.1"/></svg>;
}
function IconLogout() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M9 10l3-3-3-3M13 7H5"/></svg>;
}
