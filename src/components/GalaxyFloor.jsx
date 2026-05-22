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
  g.addColorStop(0.4,  'rgba(255,255,255,0.7)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export default function GalaxyFloor() {
  const ref = useRef();
  const isMobile = useIsMobile();
  const count = isMobile ? 3000 : 7000;
  const circleTex = useMemo(makeCircleTex, []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const pink = new THREE.Color('#FF2D95');
    const purple = new THREE.Color('#9D4EDD');
    const blue = new THREE.Color('#5B6FFF');
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 0.55) * 40 + 3;
      const x = Math.cos(angle) * rad;
      const z = Math.sin(angle) * rad;
      const y = (Math.random() - 0.5) * 3 - 1.5;
      positions.set([x, y, z], i * 3);
      const pick = Math.random();
      const col = pick < 0.5 ? pink.clone().lerp(purple, Math.random())
                : pick < 0.85 ? purple.clone()
                : blue.clone();
      colors.set([col.r, col.g, col.b], i * 3);
    }
    return { positions, colors };
  }, [count]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={circleTex}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
