import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHasHover } from '../hooks/useHasHover';

export function FavoritePersonModal({ onYes }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const hasHover = useHasHover();

  const runAway = () => {
    const x = (Math.random() - 0.5) * 300;
    const y = (Math.random() - 0.5) * 200;
    setNoPos({ x, y });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 100,
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          background: 'rgba(20,20,30,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,20,147,0.3)',
          borderRadius: 20,
          padding: '32px 28px',
          maxWidth: 360,
          width: '90%',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>🥰</div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 20,
          color: '#fff',
          marginBottom: 28,
          lineHeight: 1.5,
        }}>
          Do you want to see my favorite person?
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', position: 'relative', minHeight: 56 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onYes}
            style={{
              background: 'linear-gradient(135deg, #FF1493, #E63946)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 28px',
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(255,20,147,0.4)',
            }}
          >
            Of course 🥰
          </motion.button>

          <motion.button
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onHoverStart={hasHover ? runAway : undefined}
            onClick={!hasHover ? runAway : undefined}
            onTouchStart={(e) => { if (!hasHover) { e.preventDefault(); runAway(); } }}
            style={{
              background: '#2a2a2a',
              color: '#888',
              border: 'none',
              borderRadius: 12,
              padding: '12px 24px',
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            No way 🙄
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
