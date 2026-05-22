import { AnimatePresence, motion } from 'framer-motion';
import { useActFlow } from './hooks/useActFlow';
import Act1Matrix from './acts/Act1Matrix';
import Act2Space from './acts/Act2Space';
import Act3Transition from './acts/Act3Transition';
import Act4Card from './acts/Act4Card';
import { useState, useEffect } from 'react';
import Act6Scrapbook from './acts/Act6Scrapbook';
import { OrientationOverlay } from './components/OrientationOverlay';

const ACT2_PHASES = ['act2-loading', 'act2-modal', 'act2-main'];
const ACT4_PHASES = ['act4-envelope', 'act4-card', 'act4-gift'];
const ACT6_PHASES = ['act6-scrapbook', 'act6-letter', 'replay'];

export default function App() {
  const { current, currentIndex, next, goTo, reset, states } = useActFlow();

  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth <= 1024);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const containerStyle = {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100dvh',
    overflow: 'hidden',
    background: '#0a0a0a',
  };

  const isAct2 = ACT2_PHASES.includes(current);
  const isAct4 = ACT4_PHASES.includes(current);
  const isAct6 = ACT6_PHASES.includes(current);

  return (
    <div style={containerStyle}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <AnimatePresence mode="wait">

          {current === 'act1-matrix' && (
            <motion.div key="act1" style={{ position: 'absolute', inset: 0 }}>
              <Act1Matrix onDone={() => goTo('act2-loading')} />
            </motion.div>
          )}

          {isAct2 && (
            <motion.div key="act2" style={{ position: 'absolute', inset: 0 }}>
              <Act2Space
                phase={current}
                onPhaseChange={goTo}
                onContinue={() => goTo('act3-transition')}
              />
            </motion.div>
          )}

          {current === 'act3-transition' && (
            <motion.div key="act3" style={{ position: 'absolute', inset: 0 }}>
              <Act3Transition onDone={() => goTo('act4-envelope')} />
            </motion.div>
          )}

          {isAct4 && (
            <motion.div key="act4" style={{ position: 'absolute', inset: 0 }}>
              <Act4Card
                onNext={() => goTo('act6-scrapbook')}
              />
            </motion.div>
          )}



          {isAct6 && (
            <motion.div key="act6" style={{ position: 'absolute', inset: 0 }}>
              <Act6Scrapbook
                phase={current}
                onReset={reset}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <OrientationOverlay />
    </div>
  );
}
