import React from 'react';
const { useState } = React;

import { motion, AnimatePresence } from 'framer-motion';
import type { DeviceRequest } from './types';

interface Props { 
  request: DeviceRequest; 
  onPriceChange: (p: number) => void;
}

export default function DeviceHero({ request: r, onPriceChange }: Props) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrice, setTempPrice] = useState(r.estimatedPrice.toString());

  const thumbs = r.thumbnails.length > 0 ? r.thumbnails : [r.imageUrl];
  const currentImg = thumbs[activeThumb] || r.imageUrl;

  const handleSavePrice = () => {
    const p = parseFloat(tempPrice);
    if (!isNaN(p)) {
      onPriceChange(p);
      setIsEditing(false);
    }
  };

  return (
    <div className="db-hero">
      {/* Visual column */}
      <div className="db-hero-visual">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImg}
            className="db-hero-img-wrap"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="db-hero-img-glow" />
            {currentImg ? (
              <img src={currentImg} alt={r.deviceName} />
            ) : (
              <div className="db-hero-img-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="5" y="2" width="14" height="20" rx="3"/>
                  <circle cx="12" cy="17.5" r="1.2" fill="currentColor" stroke="none"/>
                </svg>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Thumbnail row */}
        <div className="db-thumb-row">
          {thumbs.slice(0, 4).map((t, i) => (
            <div
              key={i}
              className={`db-thumb${activeThumb === i ? ' active' : ''}`}
              onClick={() => setActiveThumb(i)}
            >
              {t ? <img src={t} alt="" /> : null}
            </div>
          ))}
          {thumbs.length > 4 && (
            <div className="db-thumb-more">+{thumbs.length - 4}</div>
          )}
        </div>
      </div>

      {/* Info column */}
      <div className="db-hero-info">
        <motion.div
          key={r.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="db-hero-device-name">{r.deviceName}</div>
          <div className="db-hero-specs">{r.storage} · {r.color}</div>
          <div className="db-hero-date">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="1.5" y="2.5" width="10" height="9" rx="1.5"/>
              <path d="M4.5 1.5v2M8.5 1.5v2M1.5 5.5h10"/>
            </svg>
            Demandée le {r.date} à {r.time}
          </div>

          <div className="db-estimation-label">Estimation actuelle</div>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="number"
                className="db-status-select"
                style={{ fontSize: '2rem', width: '160px', height: '60px', fontWeight: 800 }}
                value={tempPrice}
                onChange={e => setTempPrice(e.target.value)}
                autoFocus
              />
              <button className="db-btn-primary" onClick={handleSavePrice}>Valider</button>
              <button className="db-modify-btn" onClick={() => setIsEditing(false)}>Annuler</button>
            </div>
          ) : (
            <>
              <div className="db-estimation-price">
                {r.estimatedPrice.toLocaleString('fr-FR')} €
              </div>
              <div className="db-base-price">Prix de base : {r.basePrice.toLocaleString('fr-FR')} €</div>

              <button className="db-modify-btn" onClick={() => { setTempPrice(r.estimatedPrice.toString()); setIsEditing(true); }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M9.5 2.5l1 1L4 10l-2 .5.5-2 6.5-6.5z"/>
                </svg>
                Modifier l'estimation
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

