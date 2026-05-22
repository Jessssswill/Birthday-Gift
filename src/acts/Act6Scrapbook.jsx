import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from '../components/Typewriter';
import { scrapbookPhotos } from '../data/photos';
import { loveLetter, handwrittenNotes } from '../data/content';

// Seeded RNG for stable positions
const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const STICKER_POOL = ['🧸', '☕', '🐱', '⭐', '💖', '🌹', '🎀', '✨', '🎵', '🌸', '🦋', '🌙', '🎶'];
const ROW_H = 170; // px per photo row (2 photos per row)

// ─── Love Letter ─────────────────────────────────────────────────────────────
function LoveLetter({ onReset }) {
  const [sealBroken, setSealBroken] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60, padding: '0 16px 40px' }}>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter', fontSize: 14, marginBottom: 12 }}>
        Tap the seal to read 💌
      </div>

      <div style={{
        position: 'relative', width: '100%', maxWidth: 560,
        background: '#e8dcc8', borderRadius: 8,
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        filter: 'sepia(0.3) contrast(0.95)', overflow: 'hidden',
      }}>
        <motion.div
          onClick={() => !sealBroken && setSealBroken(true)}
          animate={sealBroken ? { scale: 1.3, opacity: 0, rotate: 15 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: sealBroken ? 'absolute' : 'relative',
            top: sealBroken ? 0 : 'auto',
            left: sealBroken ? '50%' : 'auto',
            transform: sealBroken ? 'translateX(-50%)' : 'none',
            margin: sealBroken ? 0 : '20px auto 0',
            width: 60, height: 60, borderRadius: '50%',
            background: '#C41E3A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, cursor: 'pointer', zIndex: 10,
            boxShadow: '0 4px 20px rgba(196,30,58,0.6)', userSelect: 'none',
          }}
        >❤</motion.div>

        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: sealBroken ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ transformOrigin: 'top center', padding: '20px 28px 32px' }}
        >
          <div style={{ fontFamily: '"Special Elite", cursive', fontSize: 15, color: '#2a2a2a', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
            {sealBroken && <Typewriter text={loveLetter} speed={35} onDone={() => setTypingDone(true)} />}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {typingDone && (
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={onReset}
            style={{
              marginTop: 32,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', borderRadius: 999,
              padding: '10px 24px',
              fontFamily: 'Inter, sans-serif', fontSize: 14, cursor: 'pointer',
            }}
          >Replay 🔄</motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Act6Scrapbook({ onReset }) {
  const { photoItems, noteItems, stickerItems, canvasH } = useMemo(() => {
    const N = scrapbookPhotos.length; // 191
    const rows = Math.ceil(N / 2);
    const canvasH = 80 + rows * ROW_H + 80;

    const photoItems = scrapbookPhotos.map((src, i) => ({
      src, i,
      x:      (i % 2 === 0 ? 16 : 238) + (rng(i * 7 + 1) - 0.5) * 52,
      y:      80 + Math.floor(i / 2) * ROW_H + (rng(i * 7 + 2) - 0.5) * 28,
      rotate: (rng(i * 7 + 3) - 0.5) * 22,
      size:   94 + Math.round(rng(i * 7 + 4) * 46), // 94–140 px
    }));

    // One note every ~14 photos
    const noteItems = Array.from({ length: Math.floor(N / 14) }, (_, j) => ({
      text:   handwrittenNotes[j % handwrittenNotes.length],
      x:      90 + rng(j * 31 + 1000) * 240,
      y:      80 + Math.floor(((j + 1) * 14) / 2) * ROW_H + ROW_H * 0.55,
      rotate: (rng(j * 31 + 2000) - 0.5) * 14,
    }));

    // One sticker every ~20 photos
    const stickerItems = Array.from({ length: Math.floor(N / 20) }, (_, j) => ({
      emoji:  STICKER_POOL[j % STICKER_POOL.length],
      x:      18 + rng(j * 41 + 3000) * 390,
      y:      80 + Math.floor(((j + 1) * 20) / 2) * ROW_H + rng(j * 41 + 4000) * 80,
      rotate: (rng(j * 41 + 5000) - 0.5) * 40,
      size:   40 + Math.round(rng(j * 41 + 6000) * 18),
    }));

    return { photoItems, noteItems, stickerItems, canvasH };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}
    >
      <div style={{
        minHeight: '100%',
        background: `
          radial-gradient(circle at 20% 30%, rgba(157,78,221,0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255,20,147,0.1) 0%, transparent 50%),
          repeating-linear-gradient(45deg,rgba(255,20,147,0.03) 0px,rgba(255,20,147,0.03) 2px,transparent 2px,transparent 20px),
          #1a0a1e
        `,
      }}>

        {/* Title */}
        <div style={{
          textAlign: 'center', padding: '48px 16px 20px',
          fontFamily: '"Great Vibes", cursive',
          fontSize: 'clamp(38px, 10vw, 64px)',
          color: '#fff', textShadow: '0 0 30px #FF1493',
        }}>My Favorite Girl 💕</div>

        {/* Scrapbook canvas */}
        <div style={{ position: 'relative', height: canvasH, maxWidth: 480, margin: '0 auto' }}>

          {/* Decorative stars */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${[8, 68, 18, 72, 4, 82, 38, 58][i]}%`,
              top:  `${Math.round((i / 8) * 95)}%`,
              fontSize: 80, opacity: 0.05,
              color: '#FFD700', userSelect: 'none',
              transform: `rotate(${i * 22}deg)`,
            }}>★</div>
          ))}

          {/* Photos */}
          {photoItems.map(({ src, i, x, y, rotate, size }) => (
            <div
              key={i}
              style={{
                position: 'absolute', left: x, top: y,
                transform: `rotate(${rotate}deg)`,
                zIndex: 5,
              }}
            >
              {/* Tape */}
              <div style={{
                position: 'absolute', top: -9, left: '26%',
                width: '48%', height: 13,
                background: 'rgba(255,240,180,0.62)',
                borderRadius: 3, zIndex: 10,
              }} />
              {/* Polaroid frame */}
              <div style={{
                background: '#fff', padding: '6px 6px 22px 6px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.28)', borderRadius: 3,
              }}>
                <img
                  src={src} alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ width: size, height: size, objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.style.background = '#ffd0e8'; e.target.removeAttribute('src'); }}
                />
              </div>
            </div>
          ))}

          {/* Handwritten notes */}
          {noteItems.map((note, i) => (
            <div key={i} style={{
              position: 'absolute', left: note.x, top: note.y,
              transform: `rotate(${note.rotate}deg)`,
              fontFamily: 'Caveat, cursive', fontSize: 18, color: '#2a2a2a',
              background: 'rgba(255,255,240,0.92)', padding: '10px 14px',
              borderRadius: 4, boxShadow: '0 3px 12px rgba(0,0,0,0.2)',
              maxWidth: 160, lineHeight: 1.4, zIndex: 6,
            }}>
              {note.text}
            </div>
          ))}

          {/* Stickers */}
          {stickerItems.map((s, i) => (
            <div key={i} style={{
              position: 'absolute', left: s.x, top: s.y,
              transform: `rotate(${s.rotate}deg)`,
              fontSize: s.size, zIndex: 7, userSelect: 'none',
            }}>
              {s.emoji}
            </div>
          ))}
        </div>

        {/* Love letter */}
        <div style={{ background: 'linear-gradient(180deg, transparent, rgba(10,0,30,0.9))', padding: '40px 0 0' }}>
          <LoveLetter onReset={onReset} />
        </div>

      </div>
    </motion.div>
  );
}
