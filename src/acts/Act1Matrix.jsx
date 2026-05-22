import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KATAKANA = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789';

function MatrixCanvas({ active }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const dropsRef = useRef([]);
  const fallRef = useRef(false);
  const fallProgressRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / fontSize);
      dropsRef.current = Array(cols).fill(1);
      fallProgressRef.current = Array(cols).fill(0);
    };
    resize();
    window.addEventListener('resize', resize);

    let startTime = Date.now();

    const draw = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const falling = fallRef.current;

      ctx.fillStyle = 'rgba(10,10,10,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#FF1493';
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      const speed = falling ? Math.max(0.2, 1 - (elapsed - 6) * 0.5) : 1;

      dropsRef.current.forEach((drop, i) => {
        const char = KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
        if (falling) {
          fallProgressRef.current[i] = (fallProgressRef.current[i] || 0) + 0.15 + Math.random() * 0.1;
          ctx.globalAlpha = Math.max(0, 1 - fallProgressRef.current[i] / 10);
          const y = drop * fontSize + fallProgressRef.current[i] * 40;
          ctx.fillText(char, i * fontSize, y);
        } else {
          ctx.globalAlpha = 1;
          ctx.fillText(char, i * fontSize, drop * fontSize);
        }

        if (!falling && drop * fontSize > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i] += speed;
      });

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    const t = setTimeout(() => { fallRef.current = true; }, 6000);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      clearTimeout(t);
    };
  }, [active]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

const COUNTDOWN_NUMS = ['3', '2', '1'];
const WORDS = ['HAPPY', 'BIRTHDAY', 'Angeline Alexis', '💖'];

function FloatingParticles() {
  const particles = useMemo(() => Array.from({ length: 35 }), []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0, scale: Math.random() * 0.8 + 0.2 }}
          animate={{ y: '-10vh', opacity: [0, 0.6, 0], x: `${Math.random() * 100}vw` }}
          transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 4, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: 4, height: 4, borderRadius: '50%',
            background: Math.random() > 0.5 ? '#FF1493' : '#FFB6C1',
          }}
        />
      ))}
    </div>
  );
}

export default function Act1Matrix({ onDone }) {
  const [phase, setPhase] = useState('rain'); // rain | countdown | words | heart | done
  const [countNum, setCountNum] = useState(0);
  const [wordIndex, setWordIndex] = useState(-1);
  const [showHeart, setShowHeart] = useState(false);
  const [heartExplode, setHeartExplode] = useState(false);

  useEffect(() => {
    // Phase timeline
    const t1 = setTimeout(() => setPhase('countdown'), 3000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;
    setCountNum(0);
    const timers = [
      setTimeout(() => setCountNum(1), 1000),
      setTimeout(() => setCountNum(2), 2000),
      setTimeout(() => setPhase('falling'), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'falling') return;
    const t = setTimeout(() => setPhase('words'), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'words') return;
    const timers = WORDS.map((_, i) =>
      setTimeout(() => setWordIndex(i), i * 600)
    );
    const t = setTimeout(() => setPhase('heart'), WORDS.length * 600 + 800);
    return () => [...timers, t].forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'heart') return;
    setShowHeart(true);
    const t1 = setTimeout(() => setHeartExplode(true), 2000);
    const t2 = setTimeout(() => onDone?.(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  const isRaining = phase === 'rain' || phase === 'countdown' || phase === 'falling';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100dvh', background: '#0a0a0a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <MatrixCanvas active={isRaining} />
      {!isRaining && <FloatingParticles />}

      {/* Countdown */}
      <AnimatePresence mode="wait">
        {phase === 'countdown' && (
          <motion.div
            key={`count-${countNum}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              fontSize: 'clamp(100px, 25vw, 200px)',
              fontFamily: 'Orbitron, monospace',
              fontWeight: 900,
              color: '#FF1493',
              textShadow: '0 0 40px #FF1493, 0 0 80px #FF1493',
              zIndex: 10,
              lineHeight: 1,
            }}
          >
            {COUNTDOWN_NUMS[countNum]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birthday words */}
      {phase === 'words' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 10 }}>
          {WORDS.map((w, i) => {
            const isName  = w === 'Angeline Alexis';
            const isEmoji = w === '💖';
            const isHBD   = !isName && !isEmoji;

            const wordStyle = isName ? {
              fontFamily: "'Great Vibes', cursive",
              fontWeight: 400,
              fontSize: 'clamp(70px, 18vw, 180px)',
              color: '#fff',
              lineHeight: 1.1,
              textShadow: '0 0 20px #FF1493',
            } : isHBD ? {
              fontFamily: "'Cinzel', serif",
              fontWeight: 900,
              fontSize: 'clamp(48px, 11vw, 110px)',
              color: '#fff',
              letterSpacing: '0.15em',
              lineHeight: 1.15,
              textShadow: '0 0 20px #FF1493',
            } : {};

            const wordTransition = isName
              ? { type: 'spring', stiffness: 180, damping: 10, mass: 0.8 }
              : { duration: 0.5, type: 'spring', stiffness: 200 };

            return (
              <AnimatePresence key={w}>
                {wordIndex >= i && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: isName ? [0.5, 1.12, 1] : 1, opacity: 1, y: 0 }}
                    transition={wordTransition}
                    style={wordStyle}
                  >
                    {w}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      )}

      {/* Heart */}
      {showHeart && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={heartExplode
            ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
            : { scale: [1, 1.15, 1], opacity: 1 }
          }
          transition={heartExplode
            ? { duration: 0.8, times: [0, 0.5, 1] }
            : { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ position: 'absolute', fontSize: 80, zIndex: 20, userSelect: 'none' }}
        >
          💖
        </motion.div>
      )}

      {/* Heart particle explosion */}
      <AnimatePresence>
        {heartExplode && Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const dist = 150 + Math.random() * 100;
          return (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ position: 'absolute', fontSize: 20, zIndex: 19, userSelect: 'none' }}
            >
              {['💗', '💖', '✨', '🌸'][i % 4]}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
