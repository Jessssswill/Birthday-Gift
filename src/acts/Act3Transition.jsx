import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Act3Transition({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0d0221 0%, #1a0533 50%, #0d0221 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Twinkling stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            borderRadius: '50%',
            background: '#fff',
            opacity: Math.random(),
            animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite alternate`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          fontFamily: '"Great Vibes", cursive',
          fontSize: 'clamp(32px, 8vw, 56px)',
          color: '#fff',
          textShadow: '0 0 30px #FF1493',
          textAlign: 'center',
        }}
      >
        A special message awaits...
      </motion.div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.1; }
          to { opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
}
