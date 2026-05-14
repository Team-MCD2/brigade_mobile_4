import React from 'react';
const { useState } = React;

import { motion } from 'framer-motion';
import type { DeviceRequest } from './types';

interface Props {
  onClose: () => void;
  onSubmit: (r: DeviceRequest) => void;
}

export default function NewRequestModal({ onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    deviceName: '',
    storage: '128 Go',
    color: '',
    brand: 'apple' as any,
    clientName: '',
    clientEmail: '',
    estimatedPrice: '0',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date();
    
    const newReq: DeviceRequest = {
      id,
      number: `#${Math.floor(1000 + Math.random() * 9000)}`,
      deviceName: formData.deviceName,
      storage: formData.storage,
      color: formData.color,
      brand: formData.brand,
      imageUrl: '', // placeholder
      thumbnails: [],
      estimatedPrice: parseFloat(formData.estimatedPrice),
      basePrice: parseFloat(formData.estimatedPrice) * 1.2,
      status: 'pending',
      date: now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      client: {
        id: 'c' + id,
        name: formData.clientName,
        initials: formData.clientName.split(' ').map(n => n[0]).join('').toUpperCase(),
        email: formData.clientEmail,
        phone: '',
        city: '',
        online: false
      },
      imei: '',
      unlocked: true,
      warranty: false,
      accessories: 'Non spécifié',
      condition: {
        screen: { label: 'Non spécifié', level: 'good' },
        battery: { label: 'Non spécifié', level: 'good' },
        chassis: { label: 'Non spécifié', level: 'good' },
        camera: { label: 'Non spécifié', level: 'good' },
        functional: { label: 'Non spécifié', level: 'good' },
      }
    };
    
    onSubmit(newReq);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', 
      backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', 
      alignItems: 'center', justifyContent: 'center', padding: '2rem'

    }} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        style={{
          width: '100%', maxWidth: '500px', background: 'var(--db-surface)', 
          borderRadius: '20px', border: '1px solid var(--db-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)', overflow: 'hidden', margin: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Nouvelle demande manuelle</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--db-text3)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="db-field">
              <label className="db-estimation-label">Appareil</label>
              <input 
                required
                className="db-status-select" style={{ width: '100%', padding: '0.6rem' }}
                placeholder="ex: iPhone 15 Pro"
                value={formData.deviceName}
                onChange={e => setFormData({...formData, deviceName: e.target.value})}
              />
            </div>
            <div className="db-field">
              <label className="db-estimation-label">Marque</label>
              <select 
                className="db-status-select" style={{ width: '100%', padding: '0.6rem' }}
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value as any})}
              >
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="google">Google</option>
                <option value="xiaomi">Xiaomi</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="db-field">
              <label className="db-estimation-label">Stockage</label>
              <input 
                className="db-status-select" style={{ width: '100%', padding: '0.6rem' }}
                value={formData.storage}
                onChange={e => setFormData({...formData, storage: e.target.value})}
              />
            </div>
            <div className="db-field">
              <label className="db-estimation-label">Couleur</label>
              <input 
                className="db-status-select" style={{ width: '100%', padding: '0.6rem' }}
                value={formData.color}
                onChange={e => setFormData({...formData, color: e.target.value})}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--db-border)', margin: '0.5rem 0', paddingTop: '1rem' }}>
            <div className="db-field" style={{ marginBottom: '1rem' }}>
              <label className="db-estimation-label">Nom du client</label>
              <input 
                required
                className="db-status-select" style={{ width: '100%', padding: '0.6rem' }}
                value={formData.clientName}
                onChange={e => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
            <div className="db-field" style={{ marginBottom: '1rem' }}>
              <label className="db-estimation-label">Email client</label>
              <input 
                required type="email"
                className="db-status-select" style={{ width: '100%', padding: '0.6rem' }}
                value={formData.clientEmail}
                onChange={e => setFormData({...formData, clientEmail: e.target.value})}
              />
            </div>
          </div>

          <div className="db-field">
            <label className="db-estimation-label">Prix proposé (€)</label>
            <input 
              required type="number"
              className="db-status-select" style={{ width: '100%', padding: '0.6rem', fontSize: '1.2rem', fontWeight: 700 }}
              value={formData.estimatedPrice}
              onChange={e => setFormData({...formData, estimatedPrice: e.target.value})}
            />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="db-modify-btn" style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
            <button type="submit" className="db-btn-primary" style={{ flex: 2, height: '40px', justifyContent: 'center' }}>Créer la demande</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
