import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const P = 0;
const H = 1; // hair cyan
const K = 2; // outline
const S = 3; // skin
const C = 4; // clothes
const B = 5; // clothes dark
const A = 6; // accent pink
const W = 7; // shoes

const PALETTE: Record<number, string> = {
  [P]: '',
  [H]: '#00f5ff',
  [K]: '#0a0a0f',
  [S]: '#e8d0c0',
  [C]: '#1a1a2e',
  [B]: '#12121a',
  [A]: '#ff2d7b',
  [W]: '#c8c8d0',
};

const SCALE = 3;
const SW = 16;
const SH = 22;

/* ── sprites ────────────────────────────────── */

const STAND = [
  [P, P, P, P, P, H, H, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, K, S, S, S, S, S, S, S, S, K, P, P, P],
  [P, P, P, S, S, K, S, S, S, K, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, S, S, S, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, A, S, S, S, S, S, P, P, P],
  [P, P, P, P, K, S, S, S, S, S, K, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, K, C, C, C, C, C, K, P, P, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, S, P, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, S, P, P, P, P],
  [P, P, P, S, P, K, C, C, C, K, P, S, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, P, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, P, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, B, C, P, C, B, P, P, P, P, P, P],
  [P, P, P, P, P, K, W, P, W, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, W, P, W, K, P, P, P, P, P, P],
  [P, P, P, P, K, K, K, P, K, K, K, P, P, P, P, P],
];

const WALK_R = [
  [P, P, P, P, P, H, H, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, K, S, S, S, S, S, S, S, S, K, P, P, P],
  [P, P, P, S, S, K, S, S, S, K, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, S, S, S, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, A, S, S, S, S, S, P, P, P],
  [P, P, P, P, K, S, S, S, S, S, K, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, P, P, P, P, P],
  [P, P, S, P, K, C, C, C, C, C, K, S, P, P, P, P],
  [P, P, P, P, K, C, C, C, C, C, K, P, S, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, K, C, P, P, P, C, K, P, P, P, P, P],
  [P, P, P, P, B, C, P, P, P, C, B, P, P, P, P, P],
  [P, P, P, K, W, P, P, P, P, P, W, K, P, P, P, P],
  [P, P, P, K, W, P, P, P, P, P, W, K, P, P, P, P],
  [P, P, K, K, K, P, P, P, P, K, K, K, P, P, P, P],
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P],
];

const WALK_L = [
  [P, P, P, P, P, H, H, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, K, S, S, S, S, S, S, S, S, K, P, P, P],
  [P, P, P, S, S, K, S, S, S, K, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, S, S, S, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, A, S, S, S, S, S, P, P, P],
  [P, P, P, P, K, S, S, S, S, S, K, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, K, C, C, C, C, C, K, S, P, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, P, S, P, P, P],
  [P, P, S, P, K, C, C, C, C, C, K, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, K, C, P, P, P, C, K, P, P, P, P, P],
  [P, P, P, P, B, C, P, P, P, C, B, P, P, P, P, P],
  [P, P, P, K, W, P, P, P, P, P, W, K, P, P, P, P],
  [P, P, P, K, W, P, P, P, P, P, W, K, P, P, P, P],
  [P, P, K, K, K, P, P, P, P, K, K, K, P, P, P, P],
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P],
];

// Sitting (for sleeping / idle on platform)
const SIT = [
  [P, P, P, P, P, H, H, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, K, S, S, S, S, S, S, S, S, K, P, P, P],
  [P, P, P, S, S, K, S, S, S, K, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, S, S, S, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, S, S, S, S, S, S, P, P, P],
  [P, P, P, P, K, S, S, S, S, S, K, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, K, C, C, C, C, C, K, P, P, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, S, P, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, S, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, K, C, C, C, C, C, K, P, P, P, P, P],
  [P, P, P, K, W, C, C, C, C, C, W, K, P, P, P, P],
  [P, P, P, K, W, W, W, P, W, W, W, K, P, P, P, P],
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P],
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P],
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P],
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P],
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P],
];

const WAVE_1 = [
  [P, P, P, P, P, H, H, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, K, S, S, S, S, S, S, S, S, K, P, P, P],
  [P, P, P, S, S, K, S, S, S, K, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, S, S, S, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, A, S, S, S, S, S, P, P, P],
  [P, P, P, P, K, S, S, S, S, S, K, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, K, C, C, C, C, C, K, P, S, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, P, S, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, S, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, P, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, P, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, B, C, P, C, B, P, P, P, P, P, P],
  [P, P, P, P, P, K, W, P, W, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, W, P, W, K, P, P, P, P, P, P],
  [P, P, P, P, K, K, K, P, K, K, K, P, P, P, P, P],
];

const WAVE_2 = [
  [P, P, P, P, P, H, H, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, K, S, S, S, S, S, S, S, S, K, P, P, P],
  [P, P, P, S, S, K, S, S, S, K, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, S, S, S, S, S, S, P, P, P],
  [P, P, P, S, S, S, S, A, S, S, S, S, S, P, P, P],
  [P, P, P, P, K, S, S, S, S, S, K, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, S, P, P, P],
  [P, P, P, P, K, C, C, C, C, C, K, S, P, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, P, P, P, P, P],
  [P, P, P, S, K, C, C, C, C, C, K, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, C, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, P, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, C, P, C, K, P, P, P, P, P, P],
  [P, P, P, P, P, B, C, P, C, B, P, P, P, P, P, P],
  [P, P, P, P, P, K, W, P, W, K, P, P, P, P, P, P],
  [P, P, P, P, P, K, W, P, W, K, P, P, P, P, P, P],
  [P, P, P, P, K, K, K, P, K, K, K, P, P, P, P, P],
];

const WALK_FRAMES = [STAND, WALK_R, STAND, WALK_L];

type Behavior =
  | 'offscreen'
  | 'entering'
  | 'walking'
  | 'idle'
  | 'waving'
  | 'sleeping'
  | 'powerup'
  | 'fleeing'
  | 'jumping'
  | 'exiting';

const SPEECH = [
  'こんにちは!',
  '...zzZ',
  'NANI?!',
  '>_<',
  '♪♪♪',
  'sugoi~',
  'omae wa...',
  '✧*。',
  'yare yare',
  'senpai!',
  '~nyaa',
  'kawaii',
  'gg',
  'brb',
  '*teleports*',
];

interface Platform {
  y: number; // px from bottom
  xMin: number;
  xMax: number;
}

// Page-aware platforms that align to real page elements
function getPagePlatforms(path: string, vh: number): Platform[] {
  const base: Platform[] = [
    { y: 20, xMin: 0, xMax: 1 }, // ground (footer area)
  ];

  // Navbar is always a platform (64px from top = vh - 64 from bottom)
  base.push({ y: vh - 68, xMin: 0, xMax: 1 });

  switch (path) {
    case '/':
      // Hero: just ground + navbar, keep it minimal
      break;
    case '/about':
    case '/privacy':
      base.push({ y: vh * 0.4, xMin: 0.1, xMax: 0.6 });
      base.push({ y: vh * 0.6, xMin: 0.4, xMax: 0.9 });
      break;
    case '/resume':
      // Timeline dots area
      base.push({ y: vh * 0.35, xMin: 0.05, xMax: 0.5 });
      base.push({ y: vh * 0.55, xMin: 0.3, xMax: 0.8 });
      base.push({ y: vh * 0.75, xMin: 0.1, xMax: 0.6 });
      break;
    case '/projects':
      // Card tops
      base.push({ y: vh * 0.45, xMin: 0.1, xMax: 0.55 });
      base.push({ y: vh * 0.45, xMin: 0.55, xMax: 0.95 });
      base.push({ y: vh * 0.7, xMin: 0.2, xMax: 0.8 });
      break;
    case '/anime':
      base.push({ y: vh * 0.35, xMin: 0.05, xMax: 0.4 });
      base.push({ y: vh * 0.35, xMin: 0.4, xMax: 0.7 });
      base.push({ y: vh * 0.35, xMin: 0.7, xMax: 0.98 });
      base.push({ y: vh * 0.6, xMin: 0.15, xMax: 0.85 });
      break;
    default:
      base.push({ y: vh * 0.4, xMin: 0.1, xMax: 0.9 });
  }
  return base;
}

function mirror(frame: number[][]): number[][] {
  return frame.map((row) => [...row].reverse());
}

export default function PixelMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const [speech, setSpeech] = useState('');
  const [speechPos, setSpeechPos] = useState({ x: 0, y: 0 });
  const [showPowerFx, setShowPowerFx] = useState(false);
  const [powerPos, setPowerPos] = useState({ x: 0, y: 0 });

  const drawSprite = useCallback(
    (ctx: CanvasRenderingContext2D, frame: number[][], flip: boolean) => {
      const data = flip ? mirror(frame) : frame;
      ctx.clearRect(0, 0, SW * SCALE, SH * SCALE);
      for (let y = 0; y < SH; y++) {
        for (let x = 0; x < SW; x++) {
          const px = data[y][x];
          if (px === P) continue;
          ctx.fillStyle = PALETTE[px];
          ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const vh = window.innerHeight;
    const sprW = SW * SCALE;
    const sprH = SH * SCALE;
    let platforms = getPagePlatforms(location.pathname, vh);

    const s = {
      x: -sprW - 10,
      y: vh - 20 - sprH,
      platform: 0,
      behavior: 'offscreen' as Behavior,
      direction: 1 as 1 | -1,
      frame: 0,
      tick: 0,
      timer: 200 + Math.random() * 400, // stay offscreen for a while first
      speed: 1.2,
      jumpVy: 0,
      jumpTargetPlat: 0,
      jumpTargetX: 0,
      mouseX: -9999,
      mouseY: -9999,
      speechTimer: 0,
      sleepBubbleGrow: 0,
      visible: false,
      clicked: false,
      clickCount: 0,
      clickDecay: 0,
    };

    const onMouse = (e: MouseEvent) => {
      s.mouseX = e.clientX;
      s.mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouse);

    const onClick = () => {
      s.clicked = true;
    };
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onClick);

    const onResize = () => {
      platforms = getPagePlatforms(location.pathname, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    function platY(p: Platform) {
      return window.innerHeight - p.y - sprH;
    }
    function platL(p: Platform) {
      return p.xMin * window.innerWidth;
    }
    function platR(p: Platform) {
      return p.xMax * window.innerWidth - sprW;
    }

    function pickEntrance() {
      const plat = Math.floor(Math.random() * platforms.length);
      s.platform = plat;
      const p = platforms[plat];
      s.direction = Math.random() < 0.5 ? 1 : -1;
      s.x = s.direction === 1 ? platL(p) - sprW - 5 : platR(p) + sprW + 5;
      s.y = platY(p);
      s.behavior = 'entering';
      s.speed = 1.2;
      s.timer = 999;
      s.visible = true;
    }

    const CLICK_SPEECH = ['NANI?!', 'oi!', 'やめて!', '(╯°□°)╯', 'hey!!', '!?'];

    const loop = setInterval(() => {
      s.tick++;
      const cw = window.innerWidth;
      const curPlat = platforms[s.platform] || platforms[0];

      // ── click decay ──
      if (s.clickDecay > 0) {
        s.clickDecay--;
        if (s.clickDecay <= 0) s.clickCount = 0;
      }

      // ── handle click/tap ──
      if (s.clicked && s.visible && s.behavior !== 'offscreen') {
        s.clicked = false;
        s.clickCount++;
        s.clickDecay = 40;
        setSpeech(
          CLICK_SPEECH[Math.floor(Math.random() * CLICK_SPEECH.length)],
        );
        s.speechTimer = 28;
        s.behavior = 'fleeing';
        s.direction = Math.random() < 0.5 ? -1 : 1;
        s.timer = 25;
        s.speed = 3;
      }
      s.clicked = false;

      // ── cursor flee ──
      if (
        s.visible &&
        s.behavior !== 'jumping' &&
        s.behavior !== 'offscreen' &&
        s.behavior !== 'exiting'
      ) {
        const cx = s.x + sprW / 2;
        const cy = s.y + sprH / 2;
        const dx = s.mouseX - cx;
        const dy = s.mouseY - cy;
        if (Math.sqrt(dx * dx + dy * dy) < 110) {
          s.behavior = 'fleeing';
          s.direction = dx > 0 ? -1 : 1;
          s.timer = 20;
          s.speed = 3;
        }
      }

      // ── behavior timer ──
      if (
        s.behavior !== 'jumping' &&
        s.behavior !== 'offscreen' &&
        s.behavior !== 'entering' &&
        s.behavior !== 'exiting'
      ) {
        s.timer--;
        if (s.timer <= 0) {
          s.speed = 1.2;
          const roll = Math.random();
          if (roll < 0.18) {
            // Exit screen
            s.behavior = 'exiting';
            s.direction = Math.random() < 0.5 ? -1 : 1;
            s.timer = 999;
            s.speed = 1.5;
          } else if (roll < 0.38) {
            s.behavior = 'idle';
            s.timer = 60 + Math.random() * 100;
            if (Math.random() < 0.35) {
              setSpeech(SPEECH[Math.floor(Math.random() * SPEECH.length)]);
              s.speechTimer = 60;
            }
          } else if (roll < 0.62) {
            s.behavior = 'walking';
            s.direction = Math.random() < 0.5 ? -1 : 1;
            s.timer = 60 + Math.random() * 120;
          } else if (roll < 0.72) {
            s.behavior = 'waving';
            s.timer = 50;
            setSpeech('hey! ✧');
            s.speechTimer = 45;
          } else if (roll < 0.8) {
            s.behavior = 'sleeping';
            s.timer = 100 + Math.random() * 80;
            s.sleepBubbleGrow = 0;
          } else if (roll < 0.87) {
            s.behavior = 'powerup';
            s.timer = 70;
            setSpeech('HAAA!!');
            s.speechTimer = 60;
            setShowPowerFx(true);
            setPowerPos({ x: s.x, y: s.y });
          } else if (platforms.length > 1) {
            const others = platforms
              .map((_, i) => i)
              .filter((i) => i !== s.platform);
            const target = others[Math.floor(Math.random() * others.length)];
            s.behavior = 'jumping';
            s.jumpTargetPlat = target;
            s.jumpTargetX =
              platL(platforms[target]) +
              (platR(platforms[target]) - platL(platforms[target])) *
                (0.2 + Math.random() * 0.6);
            s.jumpVy = -9;
          } else {
            s.behavior = 'walking';
            s.direction = Math.random() < 0.5 ? -1 : 1;
            s.timer = 80;
          }
        }
      }

      // ── offscreen: wait then enter ──
      if (s.behavior === 'offscreen') {
        s.timer--;
        s.visible = false;
        if (s.timer <= 0) pickEntrance();
        // clear canvas while offscreen
        ctx.clearRect(0, 0, SW * SCALE, SH * SCALE);
        canvas.style.left = '-200px';
        canvas.style.top = '-200px';
        return;
      }

      // ── entering: walk onto platform ──
      if (s.behavior === 'entering') {
        s.x += s.direction * s.speed;
        const l = platL(curPlat);
        const r = platR(curPlat);
        if (s.x >= l && s.x <= r) {
          s.behavior = 'walking';
          s.timer = 60 + Math.random() * 100;
        }
      }

      // ── exiting: walk off platform ──
      if (s.behavior === 'exiting') {
        s.x += s.direction * s.speed;
        if (s.x < -sprW - 20 || s.x > cw + 20) {
          s.behavior = 'offscreen';
          s.timer = 300 + Math.random() * 600; // 15-45 seconds offscreen
          s.visible = false;
          return;
        }
      }

      // ── movement ──
      if (s.behavior === 'walking' || s.behavior === 'fleeing') {
        s.x += s.direction * s.speed;
        const l = platL(curPlat);
        const r = platR(curPlat);
        if (s.x <= l) {
          s.x = l;
          s.direction = 1;
        }
        if (s.x >= r) {
          s.x = r;
          s.direction = -1;
        }
      }

      // ── jump physics ──
      if (s.behavior === 'jumping') {
        const tp = platforms[s.jumpTargetPlat];
        const ty = platY(tp);
        s.jumpVy += 0.4;
        s.y += s.jumpVy;
        const dxj = s.jumpTargetX - s.x;
        s.x += dxj * 0.05;
        s.direction = dxj > 0 ? 1 : -1;
        if (s.jumpVy > 0 && s.y >= ty) {
          s.y = ty;
          s.platform = s.jumpTargetPlat;
          s.behavior = 'idle';
          s.timer = 20 + Math.random() * 40;
          s.jumpVy = 0;
        }
      }

      // ── sleeping bubble ──
      if (s.behavior === 'sleeping') {
        s.sleepBubbleGrow++;
        if (s.sleepBubbleGrow % 40 === 1) {
          const dots = '.'.repeat(
            Math.min(Math.floor(s.sleepBubbleGrow / 40) + 1, 3),
          );
          setSpeech(`zzZ${dots}`);
          s.speechTimer = 35;
        }
      }

      // ── speech ──
      if (s.speechTimer > 0) {
        s.speechTimer--;
        setSpeechPos({ x: s.x + sprW / 2, y: s.y - 8 });
        if (s.speechTimer <= 0) {
          setSpeech('');
          setShowPowerFx(false);
        }
      }

      // ── render ──
      let sprite: number[][];
      const flip = s.direction === -1;

      switch (s.behavior) {
        case 'walking':
        case 'fleeing':
        case 'entering':
        case 'exiting':
          sprite = WALK_FRAMES[Math.floor(s.tick / 6) % 4];
          break;
        case 'waving':
          sprite = s.tick % 16 < 8 ? WAVE_1 : WAVE_2;
          break;
        case 'jumping':
          sprite = s.jumpVy < 0 ? WALK_R : WALK_L;
          break;
        case 'sleeping':
          sprite = SIT;
          break;
        case 'powerup':
          sprite = s.tick % 4 < 2 ? STAND : WALK_R;
          break;
        default:
          sprite = STAND;
      }

      canvas.style.left = `${Math.round(s.x)}px`;
      canvas.style.top = `${Math.round(s.y)}px`;
      drawSprite(ctx, sprite, flip);
    }, 1000 / 20);

    return () => {
      clearInterval(loop);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onClick);
    };
  }, [drawSprite, location.pathname]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={SW * SCALE}
        height={SH * SCALE}
        className="fixed top-0 left-0 z-40 cursor-pointer"
        style={{ imageRendering: 'pixelated' }}
      />
      {speech && (
        <div
          className="fixed z-40 pointer-events-none"
          style={{
            left: speechPos.x,
            top: speechPos.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-cyber-surface border border-cyber-cyan/30 rounded px-2 py-1 text-[10px] font-mono text-cyber-cyan whitespace-nowrap shadow-[0_0_10px_rgba(0,245,255,0.1)]">
            {speech}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-cyber-cyan/30" />
          </div>
        </div>
      )}
      {showPowerFx && (
        <div
          className="fixed z-30 pointer-events-none"
          style={{
            left: powerPos.x - 15,
            top: powerPos.y - 15,
            width: SW * SCALE + 30,
            height: SH * SCALE + 30,
          }}
        >
          <div className="w-full h-full rounded-full bg-cyber-yellow/10 animate-ping" />
        </div>
      )}
    </>
  );
}
