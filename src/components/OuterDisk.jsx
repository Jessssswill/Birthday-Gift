import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

function makeCircleTex() {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.7)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export default function OuterDisk() {
  const ref = useRef();
  const isMobile = useIsMobile();
  const count = isMobile ? 10000 : 25000;
  const circleTex = useMemo(makeCircleTex, []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const innerR = 5.5;   // tepat setelah saturn ring
    const outerR = 20.0;  // much wider outer disk
    const pink    = new THREE.Color('#FF2D95');
    const magenta = new THREE.Color('#E0218A');
    const purple  = new THREE.Color('#9D4EDD');

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // sangat padat di dekat ring, makin renggang ke luar
      const t = Math.pow(Math.random(), 1.8);
      const r = innerR + t * (outerR - innerR);
      positions.set([
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 0.22,
        Math.sin(angle) * r,
      ], i * 3);

      // warna sama persis dengan planet sphere
      const tc = t * 0.75;
      const col = pink.clone().lerp(purple, tc).lerp(magenta, 0.18);

      // fade to black mulai dari 50% radius — melebur ke background
      const fadeStart = 0.50;
      if (t > fadeStart) {
        const fade = 1 - (t - fadeStart) / (1 - fadeStart);
        col.multiplyScalar(Math.pow(fade, 1.6));
      }

      colors.set([col.r, col.g, col.b], i * 3);
    }
    return { positions, colors };
  }, [count]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        map={circleTex}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
