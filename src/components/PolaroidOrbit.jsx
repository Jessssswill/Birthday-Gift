import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { orbitPhotos } from '../data/photos';

// Seeded RNG — stable positions across renders
const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Pre-compute all item positions once
function computeLayout(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 * 5.7 + rng(i * 7 + 1) * 0.6;
    const ringProgress = i / count;
    const r = 7.0 + ringProgress * 9.0 + (rng(i * 7 + 2) - 0.5) * 2.0;
    items.push({
      x: Math.cos(angle) * r,
      y: (rng(i * 7 + 3) - 0.5) * 4.0,
      z: Math.sin(angle) * r,
      scale: 0.7 + rng(i * 7 + 5) * 0.3,
    });
  }
  return items;
}

export default function PolaroidOrbit() {
  const groupRef = useRef();
  const spritesRef = useRef([]);     // { sprite, targetOpacity }
  const loaderRef = useRef(null);
  const layoutRef = useRef(null);

  // Compute layout once
  if (!layoutRef.current) {
    layoutRef.current = computeLayout(orbitPhotos.length);
  }
  const layout = layoutRef.current;

  // ── Create all sprites IMPERATIVELY (no React components = no overhead) ──
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const loader = new THREE.TextureLoader();
    loaderRef.current = loader;
    const sprites = [];
    let cancelled = false;

    // Create placeholder sprites (invisible) for all positions
    for (let i = 0; i < layout.length; i++) {
      const { x, y, z, scale } = layout[i];

      const mat = new THREE.SpriteMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(mat);
      sprite.position.set(x, y, z);
      sprite.scale.set(0.50 * scale, 0.58 * scale, 1);
      sprite.visible = false;

      group.add(sprite);
      sprites.push({ sprite, mat, targetOpacity: 0, loaded: false });
    }

    spritesRef.current = sprites;

    // ── Progressive texture loading — small batches with breathing room ──
    const BATCH = 10;
    let idx = 0;

    const loadBatch = () => {
      if (cancelled || idx >= orbitPhotos.length) return;

      const end = Math.min(idx + BATCH, orbitPhotos.length);
      let pending = end - idx;

      for (let i = idx; i < end; i++) {
        const ii = i;
        loader.load(
          orbitPhotos[ii],
          (tex) => {
            if (cancelled) return;
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;

            const entry = sprites[ii];
            entry.mat.map = tex;
            entry.mat.needsUpdate = true;
            entry.sprite.visible = true;
            entry.targetOpacity = 1;
            entry.loaded = true;

            pending--;
            if (pending <= 0 && !cancelled) {
              setTimeout(loadBatch, 60); // 60ms gap between batches
            }
          },
          undefined,
          () => {
            pending--;
            if (pending <= 0 && !cancelled) {
              setTimeout(loadBatch, 60);
            }
          }
        );
      }

      idx = end;
    };

    // Start loading after a small delay so camera intro starts smooth
    const startTimer = setTimeout(loadBatch, 800);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      // Cleanup
      sprites.forEach(({ sprite, mat }) => {
        if (mat.map) mat.map.dispose();
        mat.dispose();
        group.remove(sprite);
      });
      spritesRef.current = [];
    };
  }, [layout]);

  // ── Single useFrame for rotation + fade (instead of 287 individual hooks) ──
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    // Rotate orbit
    group.rotation.y += 0.0015;

    // Fade in loaded sprites (batch process, max 30 per frame to stay light)
    const sprites = spritesRef.current;
    let processed = 0;
    for (let i = 0; i < sprites.length && processed < 30; i++) {
      const s = sprites[i];
      if (!s.loaded || s.mat.opacity >= 1) continue;
      s.mat.opacity = Math.min(1, s.mat.opacity + 0.05);
      processed++;
    }
  });

  return <group ref={groupRef} rotation={[0.16, 0, 0]} />;
}
