// All 287 photos — consistent 3-digit padding, split by extension type
const p3 = (n, ext) => `/photos/photo-${String(n).padStart(3, '0')}.${ext}`;

// 001–030: original photos (.jpg)
// 031–267: screenshots (.png)
// 268–287: WhatsApp photos (.jpg)
export const photos = [
  ...Array.from({ length: 30  }, (_, i) => p3(i + 1,   'jpg')),
  ...Array.from({ length: 237 }, (_, i) => p3(i + 31,  'png')),
  ...Array.from({ length: 20  }, (_, i) => p3(i + 268, 'jpg')),
];

export const angelineMain = '/photos/angeline-main.jpg';

// NON-OVERLAPPING allocation — every photo used exactly once, NO duplicates:
export const orbitPhotos     = photos.slice(0,   161);  // Act 2  — 161 photos (3D orbit galaxy)
export const scrapbookPhotos = photos.slice(161, 261);  // Act 6  — 100 photos (scrapbook grid)
export const heartPhotos     = photos.slice(261, 281);  // Act 5  —  20 photos (heart formation)
export const cardPhotos      = photos.slice(281, 287);  // Act 4  —   6 photos (book moments)
