import { useState, useEffect } from 'react';

export function usePreloadImages(urls) {
  const [loaded, setLoaded] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!urls || urls.length === 0) {
      setDone(true);
      return;
    }
    let count = 0;
    urls.forEach((url, i) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        count++;
        setLoaded(count);
        if (count === urls.length) setDone(true);
      };
      img.src = url;
    });
  }, []);

  return { loaded, total: urls?.length ?? 0, done };
}
