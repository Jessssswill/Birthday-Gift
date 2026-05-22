import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { SaturnLoader } from '../components/SaturnLoader';
import { FavoritePersonModal } from '../components/FavoritePersonModal';
import ParticleSphere from '../components/ParticleSphere';
import SaturnRing from '../components/SaturnRing';
import OuterDisk from '../components/OuterDisk';
import PolaroidOrbit from '../components/PolaroidOrbit';
import GalaxyFloor from '../components/GalaxyFloor';
import { useIsMobile } from '../hooks/useIsMobile';

const GREAT_VIBES = '/fonts/GreatVibes-Regular.ttf';

function CameraIntro({ onDone }) {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const done = useRef(false);
  const DUR = 4.0;
  const KEYS = [
    { t: 0.0,  pos: new THREE.Vector3(0,  0.0, 30) },
    { t: 0.30, pos: new THREE.Vector3(0, -0.3, 14) },
    { t: 0.62, pos: new THREE.Vector3(0, -0.5,  4) },
    { t: 1.0,  pos: new THREE.Vector3(0,  2.5, 24) },
  ];
  const easeInOut = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const easeOut   = x => 1 - Math.pow(1 - x, 3);
  const sample = p => {
    for (let i = 0; i < KEYS.length - 1; i++) {
      const a = KEYS[i], b = KEYS[i + 1];
      if (p >= a.t && p <= b.t) {
        const raw = (p - a.t) / (b.t - a.t);
        const e = (i === KEYS.length - 2) ? easeOut(raw) : easeInOut(raw);
        return a.pos.clone().lerp(b.pos, e);
      }
    }
    return KEYS[KEYS.length - 1].pos.clone();
  };
  useFrame((_, delta) => {
    if (done.current) return;
    elapsed.current += delta;
    const p = Math.min(elapsed.current / DUR, 1);
    camera.position.copy(sample(p));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    if (p >= 1) { done.current = true; onDone?.(); }
  });
  return null;
}

function World3DText() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = 4.4 + Math.sin(clock.getElapsedTime() * 0.6) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 4.4, 0]}>
      <Text
        font={GREAT_VIBES}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.75, 0]}
        outlineWidth={0.012}
        outlineColor="#FF1493"
      >
        Only For You
      </Text>
      <Text
        font={GREAT_VIBES}
        fontSize={1.0}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.55, 0]}
        outlineWidth={0.018}
        outlineColor="#FF1493"
      >
        Angeline
      </Text>
    </group>
  );
}

function DragHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute', bottom: 90, left: 0, right: 0,
            textAlign: 'center', zIndex: 30, pointerEvents: 'none',
            fontFamily: 'Inter, sans-serif', fontSize: 13,
            color: '#ccc', letterSpacing: 2,
          }}
        >
          ✨ drag to rotate · pinch to zoom ✨
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Act2Space({ phase, onPhaseChange, onContinue }) {
  const isMobile = useIsMobile();
  const [introDone, setIntroDone] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [continueVisible, setContinueVisible] = useState(false);

  useEffect(() => {
    if (phase === 'act2-main') {
      const t = setTimeout(() => setContinueVisible(true), 10000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (!introDone) return;
    const t = setTimeout(() => setTextVisible(true), 600);
    return () => clearTimeout(t);
  }, [introDone]);

  useEffect(() => {
    if (phase === 'act2-loading') {
      const t = setTimeout(() => onPhaseChange('act2-modal'), 3500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === 'act2-loading') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <SaturnLoader />
      </motion.div>
    );
  }

  if (phase === 'act2-modal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      >
        <FavoritePersonModal onYes={() => onPhaseChange('act2-main')} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 55 }}
        style={{ background: 'radial-gradient(ellipse at center, #1a0533 0%, #050011 85%)' }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.25]}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 0, 0]} color="#FF2D95" intensity={2.2} distance={12} />
        <pointLight position={[-10, 6, -6]} color="#9D4EDD" intensity={0.6} />

        <Stars radius={300} depth={120} count={isMobile ? 1000 : 2500} factor={4} fade saturation={0}   speed={0.3} />
        <Stars radius={120} depth={60}  count={isMobile ? 400  : 800} factor={3} fade saturation={0.6} speed={0.6} />

        {!introDone && <CameraIntro onDone={() => setIntroDone(true)} />}

        <OrbitControls
          enabled={introDone}
          enableDamping
          dampingFactor={0.05}
          enablePan={false}
          enableZoom={true}
          minDistance={7}
          maxDistance={45}
          autoRotate={introDone}
          autoRotateSpeed={0.4}
          touches={{ ONE: 1, TWO: 2 }}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 5 / 6}
        />

        <Suspense fallback={null}>
          <ParticleSphere />
          <SaturnRing />
          <OuterDisk />
          <GalaxyFloor />
        </Suspense>

        <PolaroidOrbit />

        <Suspense fallback={null}>
          <World3DText />
        </Suspense>
      </Canvas>

      {introDone && <DragHint />}

      <AnimatePresence>
        {introDone && continueVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={onContinue}
            style={{
              position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
              zIndex: 50,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,20,147,0.5)',
              borderRadius: 999,
              padding: '12px 28px',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(255,20,147,0.3)',
            }}
          >
            Continue →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
