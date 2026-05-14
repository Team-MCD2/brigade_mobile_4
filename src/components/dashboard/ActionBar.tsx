import React from 'react';
import { motion } from 'framer-motion';
import type { DeviceRequest } from './types';

interface Props { 
  request: DeviceRequest; 
  onStatusChange: (s: RequestStatus) => void;
  onNav: (key: string) => void;
}

export default function ActionBar({ request: r, onStatusChange, onNav }: Props) {

  return (
    <div className="db-action-bar">
      <motion.button
        className="db-action-btn validate"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          onStatusChange('offer_sent');
          import('./db').then(({ DB }) => DB.notifyAdmin('Offre envoyée', `L'offre de ${r.estimatedPrice}€ a été envoyée par email à ${r.client.name}`));
        }}
      >

        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 7l4 4 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {r.status === 'offer_sent' ? 'Offre déjà envoyée' : 'Envoyer l\'offre'}
      </motion.button>

      <motion.button
        className="db-action-btn contact"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNav('messages')}
      >

        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 8a2 2 0 01-2 2H4l-3 3V3a2 2 0 012-2h7a2 2 0 012 2v5z"/>
        </svg>
        Contacter le client
      </motion.button>

      <motion.button
        className="db-action-btn refuse"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onStatusChange('refused')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round"/>
        </svg>
        Refuser la reprise
      </motion.button>
    </div>
  );
}

