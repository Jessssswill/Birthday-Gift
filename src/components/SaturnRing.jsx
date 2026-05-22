import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

function makeCircleTex() {
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.6)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

export default function SaturnRing() {
  const ref = useRef();
  const isMobile = useIsMobile();
  const count = isMobile ? 3500 : 9000;
  const circleTex = useMemo(makeCircleTex, []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const innerR = 3.0;   // starts right at planet surface — no gap
    const outerR = 5.5;
    const white = new THREE.Color('#FFE0EE');
    const pink  = new THREE.Color('#FF2D95');
    const gold  = new THREE.Color('#FFD0A0');

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // denser toward the inner edge
      const t = Math.pow(Math.random(), 1.4);
      const r = innerR + t * (outerR - innerR);
      positions.set([
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 0.22,
        Math.sin(angle) * r,
      ], i * 3);

      const pick = Math.random();
      const col = pick < 0.55 ? white.clone().lerp(pink, Math.random() * 0.45)
                : pick < 0.82 ? pink.clone()
                : gold.clone();
      colors.set([col.r, col.g, col.b], i * 3);
    }
    return { positions, colors };
  }, [count]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0010;
  });

  // flat equatorial ring, no tilt
  return (
    <group rotation={[0, 0, 0]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          map={circleTex}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
