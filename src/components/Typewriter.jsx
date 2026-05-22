import { useState, useEffect, useRef } from 'react';

export function Typewriter({ text, speed = 35, onDone, className }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);

    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(timerRef.current);
        setDone(true);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-pulse">|</span>}
    </span>
  );
}
