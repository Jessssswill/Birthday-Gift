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
  g.addColorStop(0.45, 'rgba(255,255,255,0.8)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export default function ParticleSphere() {
  const ref = useRef();
  const coreRef = useRef();
  const isMobile = useIsMobile();
  const count = isMobile ? 1500 : 3500;
  const coreCount = isMobile ? 100 : 200;
  const circleTex = useMemo(makeCircleTex, []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const radius = 3.0;
    const pink    = new THREE.Color('#FF2D95');
    const magenta = new THREE.Color('#E0218A');
    const purple  = new THREE.Color('#9D4EDD');
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = radius * (0.88 + Math.random() * 0.22);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      positions.set([x, y, z], i * 3);
      const t = (y / radius + 1) / 2;
      const col = pink.clone().lerp(purple, t * 0.7).lerp(magenta, 0.15);
      const distNorm  = r / radius;
      const coreBoost = THREE.MathUtils.clamp(1.6 - distNorm, 0, 0.8);
      col.r = Math.min(1, col.r + coreBoost * 0.4);
      col.g = Math.min(1, col.g + coreBoost * 0.15);
      col.b = Math.min(1, col.b + coreBoost * 0.4);
      colors.set([col.r, col.g, col.b], i * 3);
    }
    return { positions, colors };
  }, [count]);

  const { positions: corePositions, colors: coreColors } = useMemo(() => {
    const positions = new Float32Array(coreCount * 3);
    const colors    = new Float32Array(coreCount * 3);
    const brightPink = new THREE.Color('#FF8FC7');
    const white      = new THREE.Color('#FFFFFF');
    for (let i = 0; i < coreCount; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / coreCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = Math.random() * 1.0;
      positions.set([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ], i * 3);
      const col = brightPink.clone().lerp(white, Math.random() * 0.4);
      colors.set([col.r, col.g, col.b], i * 3);
    }
    return { positions, colors };
  }, [coreCount]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y += 0.0012;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.05;
    ref.current.scale.setScalar(1 + 0.025 * Math.sin(t * 0.8));
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.0012;
      coreRef.current.rotation.x = Math.sin(t * 0.4) * 0.05;
      coreRef.current.scale.setScalar(1 + 0.025 * Math.sin(t * 0.8));
    }
  });

  return (
    <group>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          map={circleTex}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={coreCount} array={corePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color"    count={coreCount} array={coreColors}    itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          map={circleTex}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
