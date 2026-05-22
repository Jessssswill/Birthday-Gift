import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function OrientationOverlay() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if the device is in portrait mode and is likely a mobile/tablet
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth <= 1024;
      setIsPortrait(portrait);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <AnimatePresence>
      {isPortrait && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10, 2, 20, 0.98)',
            backdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', textAlign: 'center', padding: 24
          }}
        >
          <motion.div
            animate={{ rotate: -90 }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1, ease: "easeInOut" }}
            style={{ fontSize: 72, marginBottom: 24, transformOrigin: 'center' }}
          >
            📱
          </motion.div>
          <h2 style={{ fontFamily: '"Great Vibes", cursive', fontSize: 42, color: '#FF1493', marginBottom: 12, textShadow: '0 0 20px #FF1493' }}>
            Please rotate your device
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#ccc', maxWidth: 320, lineHeight: 1.6 }}>
            For the most magical and interactive experience, please view this gift in landscape mode. ✨
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
