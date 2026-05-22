// src/data/flowers.js
export const flowers = Array.from({ length: 14 }, (_, i) =>
  `/flowers/flower-${String(i + 1).padStart(2, '0')}.png`
);
