import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onLogin: (pass: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo/dev purposes, we use a simple check. 
    // In real prod with Supabase, we would use supabase.auth.signInWithPassword()
    if (password === 'admin123') {
      onLogin(password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1a1a1a, #000)', color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '400px', padding: '2.5rem',
          background: 'rgba(255,255,255,0.03)', borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>
            BRIGADE <span style={{ color: '#f5a623' }}>MOBILE</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
            ESPACE ADMINISTRATION SÉCURISÉ
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginLeft: '0.5rem' }}>
              MOT DE PASSE
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', marginTop: '0.5rem', padding: '1rem',
                background: 'rgba(255,255,255,0.05)', border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', color: '#fff', outline: 'none', transition: '0.2s',
                fontSize: '1rem', textAlign: 'center', letterSpacing: '0.5rem'
              }}
              placeholder="••••••"
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>
              Accès refusé. Veuillez réessayer.
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '1rem', background: '#f5a623', border: 'none',
              borderRadius: '16px', color: '#000', fontWeight: 800, cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Se connecter
          </motion.button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
          © 2026 Brigade Mobile v2.5.0<br/>Système de rachat certifié
        </div>
      </motion.div>
    </div>
  );
}
