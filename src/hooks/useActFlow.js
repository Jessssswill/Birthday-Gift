import { useState, useCallback } from 'react';

export const STATES = [
  'act1-matrix',
  'act2-loading',
  'act2-modal',
  'act2-main',
  'act3-transition',
  'act4-envelope',
  'act4-card',
  'act4-gift',
  'act6-scrapbook',
  'act6-letter',
  'replay',
];

export function useActFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = STATES[currentIndex];

  const next = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, STATES.length - 1));
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((stateOrIndex) => {
    if (typeof stateOrIndex === 'number') {
      setCurrentIndex(stateOrIndex);
    } else {
      const idx = STATES.indexOf(stateOrIndex);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, []);

  const reset = useCallback(() => setCurrentIndex(0), []);

  return { current, currentIndex, next, prev, goTo, reset, states: STATES };
}
