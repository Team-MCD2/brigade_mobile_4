import React from 'react';
const { useState } = React;

import { motion, AnimatePresence } from 'framer-motion';
import type { DeviceRequest } from './types';

interface Props { request: DeviceRequest; }

export default function DeviceGallery({ request: r }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const photos = r.thumbnails.length > 0 ? r.thumbnails : [];

  return (
    <div className="db-section">
      <div className="db-gallery-header">
        <div className="db-section-title" style={{ border: 'none', padding: 0, margin: 0 }}>
          Photos envoyées ({photos.length || 6})
        </div>
        <span className="db-gallery-link">
          Voir toutes les photos
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 8L8 2M5 2h3v3"/>
          </svg>
        </span>
      </div>

      <div className="db-gallery-grid">
        {photos.slice(0, 6).map((src, i) => (
          <div
            key={i}
            className="db-gallery-item"
            onClick={() => setLightbox(src)}
          >
            <img src={src} alt={`Photo ${i + 1}`} loading="lazy" />
          </div>
        ))}
        {/* Placeholder slots if no real photos */}
        {photos.length === 0 && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="db-gallery-item">
            <div className="db-gallery-item-placeholder">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="2" y="2" width="16" height="16" rx="3"/>
                <circle cx="7.5" cy="7.5" r="2"/>
                <path d="M2 14l4-4 3 3 3-4 6 6"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-out',
            }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 16, objectFit: 'contain' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
