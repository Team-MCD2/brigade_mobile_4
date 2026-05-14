import { motion } from 'framer-motion';

export default function AnimatedBg() {
  return (
    /* Passage en 'absolute' au lieu de 'fixed' pour ne pas déborder sur le reste du site */
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#f8f9fa' }}>
      
      {/* 1. BLEU INTENSE & DYNAMIQUE */}
      <motion.div
        animate={{ 
          x: [-100, 150, -100], 
          y: [-50, 100, -50], 
          scale: [1, 1.5, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '100%', height: '100%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 60%)', /* Bleu profond */
          filter: 'blur(80px)',
          mixBlendMode: 'multiply',
        }}
      />
      
      {/* 2. ROSE INTENSE & DYNAMIQUE */}
      <motion.div
        animate={{ 
          x: [100, -150, 100], 
          y: [50, -100, 50], 
          scale: [1, 1.6, 1],
          opacity: [0.5, 0.9, 0.5]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '0%', right: '-10%', width: '100%', height: '100%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, transparent 60%)', /* Rose vif */
          filter: 'blur(90px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* 3. VIOLET/INDIGO DE LIAISON (Pour un mélange parfait entre Rose et Bleu) */}
      <motion.div
        animate={{ 
          scale: [0.8, 1.4, 0.8], 
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '20%', left: '10%', width: '80%', height: '80%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 60%)', /* Indigo */
          filter: 'blur(100px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* SUBTLE NOISE FOR APPLE TEXTURE */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', 
        backgroundSize: '24px 24px',
        zIndex: 1
      }} />

    </div>
  );
}
