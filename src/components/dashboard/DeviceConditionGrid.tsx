import React from 'react';
import { motion } from 'framer-motion';
import type { DeviceCondition, ConditionLevel } from './types';

const ITEMS: { key: keyof DeviceCondition; label: string; icon: React.ReactNode }[] = [
  { key: 'screen',     label: 'Écran',          icon: <IconScreen /> },
  { key: 'chassis',    label: 'Coque / Châssis', icon: <IconChassis /> },
  { key: 'battery',    label: 'Batterie',        icon: <IconBattery /> },
  { key: 'camera',     label: 'Caméra',          icon: <IconCamera /> },
  { key: 'faceId',     label: 'Face ID',         icon: <IconFaceId /> },
  { key: 'functional', label: 'État fonctionnel', icon: <IconCheck /> },
];

interface Props { condition: DeviceCondition; }

export default function DeviceConditionGrid({ condition }: Props) {
  return (
    <div className="db-cond-grid">
      {ITEMS.map(({ key, label, icon }, i) => {
        const item = condition[key];
        if (!item) return null;
        return (
          <motion.div
            key={key}
            className="db-cond-item"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
          >
            <div className="db-cond-icon">{icon}</div>
            <div className="db-cond-info">
              <div className="db-cond-name">{label}</div>
              <div className="db-cond-label">{item.label}</div>
            </div>
            <div className={`db-cond-dot ${item.level}`} />
          </motion.div>
        );
      })}
    </div>
  );
}

function IconScreen() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1" y="2" width="12" height="9" rx="1.5"/><path d="M4 13h6M7 11v2"/></svg>;
}
function IconChassis() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="1" width="8" height="12" rx="2"/><circle cx="7" cy="11" r=".8" fill="currentColor" stroke="none"/></svg>;
}
function IconBattery() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1" y="4" width="10" height="6" rx="1.5"/><path d="M11 6.5v1" strokeLinecap="round"/><rect x="2.5" y="5.5" width="5" height="3" rx=".5" fill="currentColor" stroke="none" opacity=".5"/></svg>;
}
function IconCamera() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 4.5A1.5 1.5 0 012.5 3h.88L4.5 1.5h5L10.62 3h.88A1.5 1.5 0 0113 4.5v6A1.5 1.5 0 0111.5 12h-9A1.5 1.5 0 011 10.5v-6z"/><circle cx="7" cy="7.5" r="2"/></svg>;
}
function IconFaceId() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 4V3a2 2 0 012-2h1M9 1h1a2 2 0 012 2v1M1 10v1a2 2 0 002 2h1M9 13h1a2 2 0 002-2v-1"/><path d="M5 6v.5M9 6v.5M5 9s.7 1 2 1 2-1 2-1"/></svg>;
}
function IconCheck() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5.5"/><path d="M4.5 7l2 2 3-3"/></svg>;
}
