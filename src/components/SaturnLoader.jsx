import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Planet core + atmosphere + 3 rings ─────────────────────────────────────
function PlanetGroup() {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((_, delta) => {
    if (groupRef.current)  groupRef.current.rotation.y  += delta * 0.4;
    if (ring1Ref.current)  ring1Ref.current.rotation.z  += delta * 0.02;
    if (ring2Ref.current)  ring2Ref.current.rotation.z  -= delta * 0.015;
    if (ring3Ref.current)  ring3Ref.current.rotation.z  += delta * 0.01;
  });

  return (
    <group ref={groupRef}>
      {/* Outer atmospheric glow */}
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial
          color="#FFAA33"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Planet core */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF4500"
          emissiveIntensity={0.4}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Ring 1 */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.8, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#AA8800"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[2.2, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#FFA500"
          emissive="#994400"
          emissiveIntensity={0.25}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Ring 3 */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0, 0.2]}>
        <torusGeometry args={[2.6, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#882200"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// ─── Orbiting moons ──────────────────────────────────────────────────────────
function Moons() {
  const m1 = useRef();
  const m2 = useRef();
  const m3 = useRef();

  useFrame((_, delta) => {
    if (m1.current) m1.current.rotation.y += delta * 0.7;
    if (m2.current) m2.current.rotation.y -= delta * 0.45;
    if (m3.current) m3.current.rotation.y += delta * 0.3;
  });

  return (
    <>
      <group ref={m1}>
        <mesh position={[2.9, 0.4, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#E8D5B7" emissive="#6A5030" emissiveIntensity={0.2} roughness={0.9} />
        </mesh>
      </group>
      <group ref={m2} rotation={[0.35, 0, 0]}>
        <mesh position={[3.6, 0, 0.4]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#D4C5A9" emissive="#504030" emissiveIntensity={0.15} roughness={0.9} />
        </mesh>
      </group>
      <group ref={m3} rotation={[-0.2, 0, 0.5]}>
        <mesh position={[0, 0.2, 3.2]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#C8B89A" roughness={1} />
        </mesh>
      </group>
    </>
  );
}

// ─── Particle dust ring ───────────────────────────────────────────────────────
function DustRing() {
  const ref = useRef();
  const count = 200;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const r = 1.4 + Math.random() * 1.6;
      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color="#FFD700"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Ambient nebula particles ─────────────────────────────────────────────────
function NebulaDust() {
  const ref = useRef();
  const count = 180;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3.5 + Math.random() * 3;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.07}
        color="#FF1493"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export function SaturnLoader() {
  return (
    <div style={{
      width: '100%',
      height: '100dvh',
      background: 'radial-gradient(ellipse at center, #1a0533 0%, #080014 60%, #000 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* CSS glow halo behind canvas */}
      <div style={{
        position: 'absolute',
        width: 420,
        height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,140,0,0.18) 0%, rgba(255,20,147,0.10) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: 340, height: 340, position: 'relative', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 2, 7], fov: 42 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 3, 5]}   intensity={1.5} color="#FFFFFF" />
          <pointLight position={[-3, -2, -3]} intensity={0.4} color="#FF1493" />
          <Stars radius={100} depth={60} count={1500} factor={3} fade saturation={0.3} />
          <DustRing />
          <NebulaDust />
          <PlanetGroup />
          <Moons />
        </Canvas>
      </div>

      <div style={{ marginTop: -8, textAlign: 'center', zIndex: 2 }}>
        <div style={{
          fontFamily: '"Great Vibes", cursive',
          fontSize: 'clamp(44px, 10vw, 68px)',
          color: '#FF8C00',
          textShadow: '0 0 20px #FF8C00, 0 0 50px #FF1493, 0 0 90px rgba(255,20,147,0.4)',
          lineHeight: 1.1,
          letterSpacing: 2,
        }}>
          Love Planet
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          marginTop: 10,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
          A world shaped with love, just for you...
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#FF1493',
              animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite alternate`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          from { opacity: 0.2; transform: scale(0.8); }
          to   { opacity: 1;   transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
