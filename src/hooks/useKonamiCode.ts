import { useEffect, useRef, useState } from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * Detects the Konami Code (↑↑↓↓←→←→BA).
 * Returns `triggered` which stays true for `duration` ms then resets.
 */
export function useKonamiCode(duration = 3000) {
  const [triggered, setTriggered] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expected = KONAMI_SEQUENCE[indexRef.current];

      if (e.key.toLowerCase() === expected.toLowerCase()) {
        indexRef.current++;

        if (indexRef.current === KONAMI_SEQUENCE.length) {
          indexRef.current = 0;
          setTriggered(true);

          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setTriggered(false);
          }, duration);
        }
      } else {
        // Reset on wrong key, but check if it matches the start
        indexRef.current =
          e.key.toLowerCase() === KONAMI_SEQUENCE[0].toLowerCase() ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [duration]);

  return triggered;
}
