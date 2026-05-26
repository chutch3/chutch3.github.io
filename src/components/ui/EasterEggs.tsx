import { useEffect, useRef, useState, useCallback } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';

/* ───────────────────── Secret keyword detection ───────────────────── */

interface KeywordMatch {
  keyword: string;
  message: string;
}

const SECRET_KEYWORDS: KeywordMatch[] = [
  { keyword: 'sudo', message: '$ sudo access denied. nice try.' },
  { keyword: 'hello', message: '>> hello, world' },
  { keyword: 'anime', message: '>> culture detected' },
];

const KEYWORD_DISPLAY_MS = 3000;

/* ───────────────────── DOM Mischief ───────────────────── */

const MISCHIEF_COOLDOWN_MS = 4000;
let lastMischiefTime = 0;

/**
 * Finds text elements near (x, y), picks a random character,
 * wraps it in a span that floats upward with a cyan glitch,
 * then restores it after 2 seconds.
 */
export function causeMischief(x: number, y: number): void {
  const now = Date.now();
  if (now - lastMischiefTime < MISCHIEF_COOLDOWN_MS) return;

  const elements = document.elementsFromPoint(x, y);

  // Also sample a few nearby points to increase our chances
  const offsets = [
    [0, 0],
    [40, 0],
    [-40, 0],
    [0, 40],
    [0, -40],
    [60, 30],
    [-60, -30],
  ];
  for (const [dx, dy] of offsets) {
    const nearby = document.elementsFromPoint(x + dx, y + dy);
    for (const el of nearby) {
      if (!elements.includes(el)) elements.push(el);
    }
  }

  // Filter to elements that contain direct text
  const textNodes: Text[] = [];
  for (const el of elements) {
    if (
      el.closest('[data-easter-egg]') ||
      el.tagName === 'CANVAS' ||
      el.tagName === 'SCRIPT' ||
      el.tagName === 'STYLE'
    ) {
      continue;
    }

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const text = node.textContent?.trim();
        return text && text.length > 1
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    let node = walker.nextNode();
    while (node) {
      textNodes.push(node as Text);
      node = walker.nextNode();
    }
  }

  if (textNodes.length === 0) return;

  const textNode = textNodes[Math.floor(Math.random() * textNodes.length)];
  const content = textNode.textContent;
  if (!content || content.trim().length < 2) return;

  // Pick a random non-whitespace character index
  const validIndices: number[] = [];
  for (let i = 0; i < content.length; i++) {
    if (content[i].trim()) validIndices.push(i);
  }
  if (validIndices.length === 0) return;

  const charIndex =
    validIndices[Math.floor(Math.random() * validIndices.length)];
  const char = content[charIndex];

  // Split the text node around the chosen character
  const parent = textNode.parentNode;
  if (!parent) return;

  const before = document.createTextNode(content.slice(0, charIndex));
  const after = document.createTextNode(content.slice(charIndex + 1));

  const span = document.createElement('span');
  span.textContent = char;
  span.style.display = 'inline-block';
  span.style.color = '#00f5ff';
  span.style.textShadow = '0 0 8px #00f5ff, 0 0 16px #00f5ff';
  span.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
  span.style.position = 'relative';
  span.style.zIndex = '50';

  parent.insertBefore(before, textNode);
  parent.insertBefore(span, textNode);
  parent.insertBefore(after, textNode);
  parent.removeChild(textNode);

  lastMischiefTime = now;

  // Animate float-up after a frame
  requestAnimationFrame(() => {
    span.style.transform = 'translateY(-18px) rotate(8deg)';
    span.style.opacity = '0.6';
  });

  // Restore after 2 seconds
  setTimeout(() => {
    const restoredText = document.createTextNode(
      (before.textContent ?? '') + char + (after.textContent ?? ''),
    );
    const spanParent = span.parentNode;
    if (!spanParent) return;

    spanParent.insertBefore(restoredText, before);
    if (before.parentNode) spanParent.removeChild(before);
    if (span.parentNode) spanParent.removeChild(span);
    if (after.parentNode) spanParent.removeChild(after);
  }, 2000);
}

/* ───────────────────── EasterEggs component ───────────────────── */

export default function EasterEggs() {
  const konamiTriggered = useKonamiCode(3000);
  const [keywordMessage, setKeywordMessage] = useState<string | null>(null);
  const [keywordStyle, setKeywordStyle] = useState<'terminal' | 'flash'>(
    'terminal',
  );
  const keystrokeBuffer = useRef('');
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Keyword listener ── */
  const handleKeyword = useCallback((matched: KeywordMatch) => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);

    setKeywordStyle(matched.keyword === 'sudo' ? 'terminal' : 'flash');
    setKeywordMessage(matched.message);

    dismissTimer.current = setTimeout(() => {
      setKeywordMessage(null);
    }, KEYWORD_DISPLAY_MS);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier-only keys and non-character keys
      if (e.key.length !== 1) return;

      keystrokeBuffer.current += e.key.toLowerCase();

      // Keep buffer from growing unbounded
      if (keystrokeBuffer.current.length > 20) {
        keystrokeBuffer.current = keystrokeBuffer.current.slice(-20);
      }

      // Check each keyword
      for (const kw of SECRET_KEYWORDS) {
        if (keystrokeBuffer.current.endsWith(kw.keyword)) {
          keystrokeBuffer.current = '';
          handleKeyword(kw);
          break;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [handleKeyword]);

  return (
    <div data-easter-egg>
      {/* ── Konami: SYSTEM BREACH overlay ── */}
      {konamiTriggered && (
        <div
          className="fixed inset-0 z-[9998] pointer-events-none"
          style={{ animation: 'breach-fade 3s ease-out forwards' }}
        >
          {/* Color inversion flash */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'white',
              mixBlendMode: 'difference',
              animation: 'breach-flash 0.6s ease-out forwards',
            }}
          />

          {/* Scanline burst */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)',
              animation: 'breach-scanlines 0.15s linear infinite',
            }}
          />

          {/* SYSTEM BREACH text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="font-heading text-4xl md:text-7xl lg:text-8xl tracking-widest text-center select-none"
              style={{
                color: '#ff2d7b',
                textShadow:
                  '0 0 20px #ff2d7b, 0 0 40px #ff2d7b, 0 0 80px #00f5ff, 0 0 120px #00f5ff',
                animation: 'breach-text 3s ease-out forwards',
              }}
            >
              SYSTEM BREACH
            </div>
          </div>

          {/* Glitch bars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full"
                style={{
                  height: `${2 + Math.random() * 6}px`,
                  top: `${10 + i * 15 + Math.random() * 5}%`,
                  backgroundColor:
                    i % 2 === 0
                      ? 'rgba(0, 245, 255, 0.3)'
                      : 'rgba(255, 45, 123, 0.3)',
                  animation: `breach-bar-${i % 2 === 0 ? 'left' : 'right'} 0.2s linear infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Keyword popups ── */}
      {keywordMessage && keywordStyle === 'terminal' && (
        <div
          className="fixed bottom-8 left-1/2 z-[9997] pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
            animation: 'popup-slide-up 0.3s ease-out',
          }}
        >
          <div className="bg-cyber-bg/95 border border-cyber-cyan/60 rounded px-5 py-3 neon-border-cyan">
            <span className="font-mono text-sm text-cyber-cyan cursor-blink">
              {keywordMessage}
            </span>
          </div>
        </div>
      )}

      {keywordMessage && keywordStyle === 'flash' && (
        <div
          className="fixed top-1/3 left-1/2 z-[9997] pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
            animation: 'popup-flash 0.3s ease-out',
          }}
        >
          <div
            className="font-mono text-lg text-cyber-cyan neon-cyan whitespace-nowrap"
            style={{ letterSpacing: '0.15em' }}
          >
            {keywordMessage}
          </div>
        </div>
      )}

      {/* ── Keyframe styles (injected once) ── */}
      <style>{`
        @keyframes breach-fade {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes breach-flash {
          0% { opacity: 0.7; }
          30% { opacity: 0.4; }
          60% { opacity: 0.15; }
          100% { opacity: 0; }
        }

        @keyframes breach-scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }

        @keyframes breach-text {
          0% {
            opacity: 0;
            transform: scale(1.5) translateY(-10px);
            filter: blur(8px);
          }
          15% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
          20% {
            transform: translateX(-4px);
          }
          25% {
            transform: translateX(4px);
          }
          30% {
            transform: translateX(-2px);
          }
          35% {
            transform: translateX(0);
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            filter: blur(4px);
          }
        }

        @keyframes breach-bar-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes breach-bar-right {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes popup-slide-up {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes popup-flash {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
