import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const x = 0;
const H = 1; // hair (cyan)
const K = 2; // outline
const S = 3; // skin
const C = 4; // clothes
const B = 5; // clothes dark
const A = 6; // accent (pink)
const G = 7; // glow (cyan, for shoes/details)

const PALETTE: Record<number, string> = {
  [x]: '',
  [H]: '#00f5ff',
  [K]: '#12121a',
  [S]: '#6b6b80',
  [C]: '#1a1a2e',
  [B]: '#0a0a0f',
  [A]: '#ff2d7b',
  [G]: '#00f5ff',
};

const GLOW_COLOR = 'rgba(0, 245, 255, 0.25)';
const OC_GLOW = 'rgba(255, 45, 123, 0.35)';

const OC_PALETTE: Record<number, string> = {
  [x]: '',
  [H]: '#ff2d7b',
  [K]: '#12121a',
  [S]: '#8b7080',
  [C]: '#2a1a2e',
  [B]: '#0a0a0f',
  [A]: '#f5ff00',
  [G]: '#ff2d7b',
};

const CLICKS_TO_OVERCLOCK = 5;
const CLICK_WINDOW = 40; // ticks (~2 seconds)
const OVERCLOCK_DURATION = 130; // ticks (~6.5 seconds)

const OC_SPEECH = [
  '▓ SYSTEM_OVERRIDE ▓',
  'オーバークロック',
  'LIMIT//BREAK',
  '>>> MAX POWER <<<',
  '[ UNLOCKED ]',
  'root@cyber:~#',
];
const SCALE = 4;
const SPW = 16;
const SPH = 22;

/* prettier-ignore */
const STAND = [
  [x,x,x,x,x,H,H,H,H,H,H,x,x,x,x,x],
  [x,x,x,x,H,H,H,H,H,H,H,H,x,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,K,S,S,S,S,S,S,S,S,K,x,x,x],
  [x,x,x,S,S,K,S,S,S,K,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,S,S,S,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,A,S,S,S,S,S,x,x,x],
  [x,x,x,x,K,S,S,S,S,S,K,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,K,C,C,C,C,C,K,x,x,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,S,x,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,S,x,x,x,x],
  [x,x,x,S,x,K,C,C,C,K,x,S,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,x,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,x,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,B,C,x,C,B,x,x,x,x,x,x],
  [x,x,x,x,x,K,G,x,G,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,G,x,G,K,x,x,x,x,x,x],
  [x,x,x,x,K,K,K,x,K,K,K,x,x,x,x,x],
];

/* prettier-ignore */
const WALK_R = [
  [x,x,x,x,x,H,H,H,H,H,H,x,x,x,x,x],
  [x,x,x,x,H,H,H,H,H,H,H,H,x,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,K,S,S,S,S,S,S,S,S,K,x,x,x],
  [x,x,x,S,S,K,S,S,S,K,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,S,S,S,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,A,S,S,S,S,S,x,x,x],
  [x,x,x,x,K,S,S,S,S,S,K,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,x,x,x,x,x],
  [x,x,S,x,K,C,C,C,C,C,K,S,x,x,x,x],
  [x,x,x,x,K,C,C,C,C,C,K,x,S,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,K,C,x,x,x,C,K,x,x,x,x,x],
  [x,x,x,x,B,C,x,x,x,C,B,x,x,x,x,x],
  [x,x,x,K,G,x,x,x,x,x,G,K,x,x,x,x],
  [x,x,x,K,G,x,x,x,x,x,G,K,x,x,x,x],
  [x,x,K,K,K,x,x,x,x,K,K,K,x,x,x,x],
  [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
];

/* prettier-ignore */
const WALK_L = [
  [x,x,x,x,x,H,H,H,H,H,H,x,x,x,x,x],
  [x,x,x,x,H,H,H,H,H,H,H,H,x,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,K,S,S,S,S,S,S,S,S,K,x,x,x],
  [x,x,x,S,S,K,S,S,S,K,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,S,S,S,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,A,S,S,S,S,S,x,x,x],
  [x,x,x,x,K,S,S,S,S,S,K,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,K,C,C,C,C,C,K,S,x,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,x,S,x,x,x],
  [x,x,S,x,K,C,C,C,C,C,K,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,K,C,x,x,x,C,K,x,x,x,x,x],
  [x,x,x,x,B,C,x,x,x,C,B,x,x,x,x,x],
  [x,x,x,K,G,x,x,x,x,x,G,K,x,x,x,x],
  [x,x,x,K,G,x,x,x,x,x,G,K,x,x,x,x],
  [x,x,K,K,K,x,x,x,x,K,K,K,x,x,x,x],
  [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
];

/* prettier-ignore */
const WAVE_1 = [
  [x,x,x,x,x,H,H,H,H,H,H,x,x,x,x,x],
  [x,x,x,x,H,H,H,H,H,H,H,H,x,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,K,S,S,S,S,S,S,S,S,K,x,x,x],
  [x,x,x,S,S,K,S,S,S,K,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,S,S,S,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,A,S,S,S,S,S,x,x,x],
  [x,x,x,x,K,S,S,S,S,S,K,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,K,C,C,C,C,C,K,x,S,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,x,S,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,S,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,x,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,x,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,B,C,x,C,B,x,x,x,x,x,x],
  [x,x,x,x,x,K,G,x,G,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,G,x,G,K,x,x,x,x,x,x],
  [x,x,x,x,K,K,K,x,K,K,K,x,x,x,x,x],
];

/* prettier-ignore */
const WAVE_2 = [
  [x,x,x,x,x,H,H,H,H,H,H,x,x,x,x,x],
  [x,x,x,x,H,H,H,H,H,H,H,H,x,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,K,S,S,S,S,S,S,S,S,K,x,x,x],
  [x,x,x,S,S,K,S,S,S,K,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,S,S,S,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,A,S,S,S,S,S,x,x,x],
  [x,x,x,x,K,S,S,S,S,S,K,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,S,x,x,x],
  [x,x,x,x,K,C,C,C,C,C,K,S,x,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,x,x,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,x,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,C,x,C,K,x,x,x,x,x,x],
  [x,x,x,x,x,B,C,x,C,B,x,x,x,x,x,x],
  [x,x,x,x,x,K,G,x,G,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,G,x,G,K,x,x,x,x,x,x],
  [x,x,x,x,K,K,K,x,K,K,K,x,x,x,x,x],
];

/* prettier-ignore */
const SIT = [
  [x,x,x,x,x,H,H,H,H,H,H,x,x,x,x,x],
  [x,x,x,x,H,H,H,H,H,H,H,H,x,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,H,H,H,H,H,H,H,H,H,H,x,x,x],
  [x,x,x,K,S,S,S,S,S,S,S,S,K,x,x,x],
  [x,x,x,S,S,K,S,S,S,K,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,S,S,S,S,S,S,x,x,x],
  [x,x,x,S,S,S,S,S,S,S,S,S,S,x,x,x],
  [x,x,x,x,K,S,S,S,S,S,K,x,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,K,C,C,C,C,C,K,x,x,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,S,x,x,x,x],
  [x,x,x,S,K,C,C,C,C,C,K,S,x,x,x,x],
  [x,x,x,x,x,K,C,C,C,K,x,x,x,x,x,x],
  [x,x,x,x,K,C,C,C,C,C,K,x,x,x,x,x],
  [x,x,x,x,B,G,G,x,G,G,B,x,x,x,x,x],
  [x,x,x,x,K,K,K,x,K,K,K,x,x,x,x,x],
  [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
  [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
  [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
  [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
  [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
];

const WALK_FRAMES = [STAND, WALK_R, STAND, WALK_L];
const WAVE_FRAMES = [WAVE_1, WAVE_2];

type Behavior =
  | 'offscreen'
  | 'glitchIn'
  | 'walking'
  | 'idle'
  | 'waving'
  | 'powerup'
  | 'narutorun'
  | 'sleeping'
  | 'sitting'
  | 'fleeing'
  | 'jumping'
  | 'glitchOut'
  | 'clicked'
  | 'transforming'
  | 'overclocked';

interface Platform {
  y: number;
  xMin: number;
  xMax: number;
}

const ROUTE_PLATFORMS: Record<string, Platform[]> = {
  '/': [
    { y: 20, xMin: 0, xMax: 1 },
    { y: 200, xMin: 0.1, xMax: 0.5 },
    { y: 350, xMin: 0.4, xMax: 0.9 },
  ],
  '/about': [
    { y: 20, xMin: 0, xMax: 1 },
    { y: 250, xMin: 0.15, xMax: 0.75 },
  ],
  '/resume': [
    { y: 20, xMin: 0, xMax: 1 },
    { y: 300, xMin: 0.05, xMax: 0.45 },
    { y: 300, xMin: 0.55, xMax: 0.95 },
    { y: 500, xMin: 0.2, xMax: 0.8 },
  ],
  '/projects': [
    { y: 20, xMin: 0, xMax: 1 },
    { y: 280, xMin: 0.05, xMax: 0.5 },
    { y: 280, xMin: 0.5, xMax: 0.95 },
  ],
  '/anime': [
    { y: 20, xMin: 0, xMax: 1 },
    { y: 250, xMin: 0.05, xMax: 0.35 },
    { y: 250, xMin: 0.35, xMax: 0.65 },
    { y: 250, xMin: 0.65, xMax: 0.95 },
  ],
  '/blog': [
    { y: 20, xMin: 0, xMax: 1 },
    { y: 300, xMin: 0.2, xMax: 0.8 },
  ],
  '/privacy': [
    { y: 20, xMin: 0, xMax: 1 },
    { y: 280, xMin: 0.15, xMax: 0.75 },
  ],
};

const IDLE_SPEECH = ['...zzZ', '♪♪♪', '✧*。', 'yare yare', '( ◕‿◕ )'];
const NARUTO_SPEECH = ['ikuzo!!', 'dattebayo!'];
const CLICK_SPEECH = ['NANI?!', 'oi!', 'やめて!', '(╯°□°)╯', 'hey!!', '!?'];

function mirrorFrame(frame: number[][]): number[][] {
  return frame.map((row) => [...row].reverse());
}

export default function PixelMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const [speech, setSpeech] = useState('');
  const [speechPos, setSpeechPos] = useState({ x: 0, y: 0 });
  const [glitchFx, setGlitchFx] = useState(false);
  const [fxPos, setFxPos] = useState({ x: 0, y: 0 });
  const [ocAura, setOcAura] = useState(false);
  const routeRef = useRef(location.pathname);
  const clickRef = useRef(false);

  useEffect(() => {
    routeRef.current = location.pathname;
  }, [location.pathname]);

  const drawSprite = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      frame: number[][],
      flip: boolean,
      glitch = false,
      oc = false,
    ) => {
      const data = flip ? mirrorFrame(frame) : frame;
      const cw = SPW * SCALE;
      const ch = SPH * SCALE;
      const pal = oc ? OC_PALETTE : PALETTE;
      const glowCol = oc ? OC_GLOW : GLOW_COLOR;
      const glowShadow = oc ? '#ff2d7b' : '#00f5ff';
      ctx.clearRect(0, 0, cw, ch);

      // Neon glow underlay
      ctx.shadowColor = glowShadow;
      ctx.shadowBlur = oc ? 12 : 6;
      for (let row = 0; row < SPH; row++) {
        for (let col = 0; col < SPW; col++) {
          if (data[row][col] === x) continue;
          ctx.fillStyle = glowCol;
          ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
        }
      }
      ctx.shadowBlur = 0;

      // Glitch: offset color channels
      if (glitch || oc) {
        const offset = oc ? 5 : 3;
        ctx.globalAlpha = oc ? 0.5 : 0.4;
        for (let row = 0; row < SPH; row++) {
          for (let col = 0; col < SPW; col++) {
            if (data[row][col] === x) continue;
            ctx.fillStyle = oc ? '#ff2d7b' : '#00f5ff';
            ctx.fillRect(col * SCALE - offset, row * SCALE, SCALE, SCALE);
            ctx.fillStyle = oc ? '#f5ff00' : '#ff2d7b';
            ctx.fillRect(col * SCALE + offset, row * SCALE, SCALE, SCALE);
          }
        }
        ctx.globalAlpha = 1;
      }

      // Main sprite with palette
      for (let row = 0; row < SPH; row++) {
        for (let col = 0; col < SPW; col++) {
          const pixel = data[row][col];
          if (pixel === x) continue;
          ctx.fillStyle = pal[pixel];
          ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
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

    const sprW = SPW * SCALE;
    const sprH = SPH * SCALE;

    const s = {
      posX: -sprW - 50,
      posY: 0,
      behavior: 'offscreen' as Behavior,
      direction: 1,
      tick: 0,
      timer: 100 + Math.random() * 150,
      platform: 0,
      speed: 1.2,
      jumpVy: 0,
      jumpTarget: -1,
      mouseX: -9999,
      mouseY: -9999,
      speechTimer: 0,
      sleepBubbleGrow: 0,
      visible: false,
      behaviorsThisVisit: 0,
      glitchTimer: 0,
      clickCount: 0,
      clickDecay: 0,
      overclocked: false,
      ocTimer: 0,
    };

    function getPlatformsForRoute(): Platform[] {
      return ROUTE_PLATFORMS[routeRef.current] || ROUTE_PLATFORMS['/'];
    }
    function platLeft(p: Platform) {
      return p.xMin * window.innerWidth;
    }
    function platRight(p: Platform) {
      return p.xMax * window.innerWidth - sprW;
    }
    function platYPos(p: Platform) {
      return window.innerHeight - p.y - sprH;
    }

    function showSpeech(msg: string, dur = 60) {
      setSpeech(msg);
      s.speechTimer = dur;
    }

    function pickEntrance() {
      const plats = getPlatformsForRoute();
      s.platform = Math.floor(Math.random() * plats.length);
      const p = plats[s.platform];
      s.direction = Math.random() < 0.5 ? 1 : -1;
      const edge = s.direction === 1 ? platLeft(p) + 20 : platRight(p) - 20;
      s.posX = edge;
      s.posY = platYPos(p);
      s.behavior = 'glitchIn';
      s.glitchTimer = 15;
      s.timer = 999;
      s.visible = true;
      s.behaviorsThisVisit = 0;
      setGlitchFx(true);
      setFxPos({ x: s.posX, y: s.posY });
    }

    function pickBehavior() {
      s.behaviorsThisVisit++;
      const roll = Math.random();
      s.speed = 1.2;
      const canExit = s.behaviorsThisVisit >= 3;

      if (roll < 0.2) {
        s.behavior = 'walking';
        s.direction = Math.random() < 0.5 ? -1 : 1;
        s.timer = 50 + Math.random() * 80;
      } else if (roll < 0.3) {
        s.behavior = 'idle';
        s.timer = 40 + Math.random() * 60;
        if (Math.random() < 0.5)
          showSpeech(
            IDLE_SPEECH[Math.floor(Math.random() * IDLE_SPEECH.length)],
          );
      } else if (roll < 0.4) {
        s.behavior = 'waving';
        s.timer = 45;
        showSpeech('hey! ✧');
      } else if (roll < 0.48) {
        s.behavior = 'powerup';
        s.timer = 65;
        showSpeech('HAAA!!', 55);
        setGlitchFx(true);
        setFxPos({ x: s.posX, y: s.posY });
      } else if (roll < 0.58) {
        s.behavior = 'narutorun';
        s.direction = Math.random() < 0.5 ? -1 : 1;
        s.timer = 40 + Math.random() * 35;
        s.speed = 2.5;
        showSpeech(
          NARUTO_SPEECH[Math.floor(Math.random() * NARUTO_SPEECH.length)],
          30,
        );
      } else if (roll < 0.66) {
        s.behavior = 'sleeping';
        s.timer = 70 + Math.random() * 50;
        s.sleepBubbleGrow = 0;
      } else if (roll < 0.74) {
        s.behavior = 'sitting';
        s.timer = 60 + Math.random() * 40;
        if (Math.random() < 0.5) showSpeech('( ˘ω˘ )', 40);
      } else if (roll < 0.88) {
        const plats = getPlatformsForRoute();
        if (plats.length > 1) {
          const others = plats.map((_, i) => i).filter((i) => i !== s.platform);
          s.jumpTarget = others[Math.floor(Math.random() * others.length)];
          s.behavior = 'jumping';
          s.jumpVy = -8;
          s.timer = 999;
        } else {
          s.behavior = 'walking';
          s.timer = 50;
        }
      } else if (canExit) {
        s.behavior = 'glitchOut';
        s.glitchTimer = 15;
        setGlitchFx(true);
        setFxPos({ x: s.posX, y: s.posY });
      } else {
        s.behavior = 'walking';
        s.timer = 50 + Math.random() * 60;
      }
    }

    const onMouse = (e: MouseEvent) => {
      s.mouseX = e.clientX;
      s.mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouse);

    const onClick = () => {
      clickRef.current = true;
    };
    canvas.addEventListener('click', onClick);

    const loop = setInterval(() => {
      s.tick++;

      // Click decay
      if (s.clickDecay > 0) {
        s.clickDecay--;
        if (s.clickDecay <= 0) s.clickCount = 0;
      }

      // Handle click/tap
      if (
        clickRef.current &&
        s.visible &&
        s.behavior !== 'offscreen' &&
        s.behavior !== 'glitchIn' &&
        s.behavior !== 'glitchOut' &&
        s.behavior !== 'transforming' &&
        s.behavior !== 'overclocked'
      ) {
        clickRef.current = false;
        s.clickCount++;
        s.clickDecay = CLICK_WINDOW;

        if (s.clickCount >= CLICKS_TO_OVERCLOCK) {
          s.clickCount = 0;
          s.behavior = 'transforming';
          s.timer = 25;
          s.glitchTimer = 25;
          showSpeech('...!!', 20);
          setGlitchFx(true);
          setFxPos({ x: s.posX, y: s.posY });
        } else {
          s.behavior = 'clicked';
          s.timer = 30;
          s.glitchTimer = 8;
          showSpeech(
            CLICK_SPEECH[Math.floor(Math.random() * CLICK_SPEECH.length)],
            28,
          );
          setGlitchFx(true);
          setFxPos({ x: s.posX, y: s.posY });
        }
      }
      clickRef.current = false;

      // Offscreen
      if (s.behavior === 'offscreen') {
        s.timer--;
        canvas.style.opacity = '0';
        if (s.timer <= 0) pickEntrance();
        return;
      }

      canvas.style.opacity = '1';
      const plats = getPlatformsForRoute();
      const curPlat = plats[s.platform] || plats[0];

      // Glitch entrance
      if (s.behavior === 'glitchIn') {
        s.glitchTimer--;
        if (s.glitchTimer <= 0) {
          setGlitchFx(false);
          s.behavior = 'idle';
          s.timer = 30 + Math.random() * 40;
        }
      }

      // Glitch exit
      if (s.behavior === 'glitchOut') {
        s.glitchTimer--;
        if (s.glitchTimer <= 0) {
          setGlitchFx(false);
          s.behavior = 'offscreen';
          s.timer = 150 + Math.random() * 250;
          s.visible = false;
        }
      }

      // Click reaction: small jump + glitch
      if (s.behavior === 'clicked') {
        s.timer--;
        if (s.timer > 20) {
          s.posY -= 2;
        } else if (s.timer > 10) {
          s.posY += 2;
        }
        s.glitchTimer = Math.max(0, s.glitchTimer - 1);
        if (s.glitchTimer <= 0) setGlitchFx(false);
        if (s.timer <= 0) {
          s.posY = platYPos(curPlat);
          s.behavior = 'fleeing';
          s.direction = Math.random() < 0.5 ? -1 : 1;
          s.timer = 25;
          s.speed = 2.5;
        }
      }

      // Transformation sequence
      if (s.behavior === 'transforming') {
        s.timer--;
        s.posY += s.tick % 2 === 0 ? -1 : 1;
        if (s.timer <= 0) {
          s.behavior = 'overclocked';
          s.overclocked = true;
          s.ocTimer = OVERCLOCK_DURATION;
          s.posY = platYPos(curPlat);
          showSpeech(
            OC_SPEECH[Math.floor(Math.random() * OC_SPEECH.length)],
            60,
          );
          setOcAura(true);
          setFxPos({ x: s.posX, y: s.posY });
        }
      }

      // Overclocked mode — erratic fast movement
      if (s.behavior === 'overclocked') {
        s.ocTimer--;
        setFxPos({ x: s.posX, y: s.posY });

        // Erratic speed changes
        s.speed = 2.5 + Math.sin(s.tick * 0.3) * 1.5;
        s.posX += s.direction * s.speed;

        // Reverse at platform edges
        const left = platLeft(curPlat);
        const right = platRight(curPlat);
        if (s.posX <= left) {
          s.posX = left;
          s.direction = 1;
        }
        if (s.posX >= right) {
          s.posX = right;
          s.direction = -1;
        }

        // Random direction changes
        if (Math.random() < 0.05) s.direction *= -1;

        // Random speech
        if (s.ocTimer === 80 || s.ocTimer === 40) {
          showSpeech(
            OC_SPEECH[Math.floor(Math.random() * OC_SPEECH.length)],
            30,
          );
        }

        // Power down
        if (s.ocTimer <= 0) {
          s.overclocked = false;
          s.behavior = 'idle';
          s.timer = 40;
          s.speed = 1.2;
          setOcAura(false);
          setGlitchFx(false);
          showSpeech('...rebooting', 40);
        }
      }

      // Cursor flee
      if (
        s.behavior !== 'jumping' &&
        s.behavior !== 'glitchOut' &&
        s.behavior !== 'glitchIn' &&
        s.behavior !== 'clicked' &&
        s.behavior !== 'transforming' &&
        s.behavior !== 'overclocked'
      ) {
        const cx = s.posX + sprW / 2;
        const cy = s.posY + sprH / 2;
        const dx = s.mouseX - cx;
        const dy = s.mouseY - cy;
        if (Math.sqrt(dx * dx + dy * dy) < 120) {
          s.behavior = 'fleeing';
          s.direction = dx > 0 ? -1 : 1;
          s.timer = 25;
          s.speed = 2.5;
        }
      }

      // Walking / fleeing / naruto
      if (
        s.behavior === 'walking' ||
        s.behavior === 'fleeing' ||
        s.behavior === 'narutorun'
      ) {
        s.posX += s.direction * s.speed;
        const left = platLeft(curPlat);
        const right = platRight(curPlat);
        if (s.posX <= left) {
          s.posX = left;
          s.direction = 1;
        }
        if (s.posX >= right) {
          s.posX = right;
          s.direction = -1;
        }
      }

      // Jump physics
      if (s.behavior === 'jumping') {
        const targetPlat = plats[s.jumpTarget] || plats[0];
        const targetY = platYPos(targetPlat);
        const targetX =
          platLeft(targetPlat) +
          (platRight(targetPlat) - platLeft(targetPlat)) * 0.5;
        s.jumpVy += 0.35;
        s.posY += s.jumpVy;
        s.posX += (targetX - s.posX) * 0.04;
        s.direction = targetX > s.posX ? 1 : -1;
        if (s.jumpVy > 0 && s.posY >= targetY) {
          s.posY = targetY;
          s.platform = s.jumpTarget;
          s.behavior = 'idle';
          s.timer = 20 + Math.random() * 30;
          s.jumpVy = 0;
        }
      }

      // Sleeping bubble
      if (s.behavior === 'sleeping') {
        s.sleepBubbleGrow = Math.min(s.sleepBubbleGrow + 0.02, 1);
        if (s.tick % 40 === 0) {
          const dots = '.'.repeat(1 + Math.floor(s.sleepBubbleGrow * 3));
          setSpeech(`zzZ${dots}`);
          s.speechTimer = 38;
        }
      }

      // Timer for behavior-driven states
      if (
        s.behavior !== 'offscreen' &&
        s.behavior !== 'glitchIn' &&
        s.behavior !== 'glitchOut' &&
        s.behavior !== 'jumping' &&
        s.behavior !== 'clicked' &&
        s.behavior !== 'transforming' &&
        s.behavior !== 'overclocked'
      ) {
        s.timer--;
        if (s.timer <= 0) pickBehavior();
      }

      // Speech pos
      if (s.speechTimer > 0) {
        s.speechTimer--;
        setSpeechPos({ x: s.posX + sprW / 2, y: s.posY - 8 });
        if (s.speechTimer <= 0) {
          setSpeech('');
        }
      }

      // Power-up glitch effect timing
      if (s.behavior === 'powerup') {
        if (s.timer < 50) {
          setGlitchFx(false);
        }
        setFxPos({ x: s.posX, y: s.posY });
      }

      // Sprite selection
      let sprite: number[][];
      const flip = s.direction === -1;
      const isGlitching =
        s.behavior === 'glitchIn' ||
        s.behavior === 'glitchOut' ||
        s.behavior === 'powerup' ||
        s.behavior === 'transforming' ||
        (s.behavior === 'clicked' && s.glitchTimer > 0);

      switch (s.behavior) {
        case 'walking':
          sprite = WALK_FRAMES[Math.floor(s.tick / 6) % 4];
          break;
        case 'fleeing':
        case 'narutorun':
          sprite = WALK_FRAMES[Math.floor(s.tick / 4) % 4];
          break;
        case 'waving':
          sprite = WAVE_FRAMES[Math.floor(s.tick / 8) % 2];
          break;
        case 'jumping':
          sprite = s.jumpVy < 0 ? WALK_R : WALK_L;
          break;
        case 'powerup':
          sprite = s.tick % 4 < 2 ? STAND : WALK_R;
          break;
        case 'sleeping':
        case 'sitting':
          sprite = SIT;
          break;
        case 'clicked':
          sprite = s.tick % 2 === 0 ? STAND : WALK_R;
          break;
        case 'glitchIn':
        case 'glitchOut':
          sprite =
            s.glitchTimer % 3 === 0
              ? STAND
              : s.glitchTimer % 3 === 1
                ? WALK_R
                : WALK_L;
          break;
        case 'transforming':
          sprite = s.tick % 2 === 0 ? STAND : WALK_R;
          break;
        case 'overclocked':
          sprite = WALK_FRAMES[Math.floor(s.tick / 3) % 4];
          break;
        default:
          sprite = STAND;
      }

      // Flicker opacity during glitch entrance/exit
      if (s.behavior === 'glitchIn' || s.behavior === 'glitchOut') {
        canvas.style.opacity = s.tick % 2 === 0 ? '1' : '0.3';
      }
      // Transformation flicker between normal and OC palette
      if (s.behavior === 'transforming') {
        canvas.style.opacity = s.tick % 3 === 0 ? '0.4' : '1';
      }

      canvas.style.transform = `translate(${Math.round(s.posX)}px, ${Math.round(s.posY)}px)`;
      drawSprite(
        ctx,
        sprite,
        flip,
        isGlitching,
        s.overclocked || (s.behavior === 'transforming' && s.timer < 15),
      );
    }, 1000 / 20);

    return () => {
      clearInterval(loop);
      window.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('click', onClick);
    };
  }, [drawSprite]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={SPW * SCALE}
        height={SPH * SCALE}
        className="fixed top-0 left-0 z-40 cursor-pointer opacity-0 transition-opacity duration-300"
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
          <div className="animated-border rounded px-2 py-1">
            <div className="text-[10px] font-mono text-cyber-cyan whitespace-nowrap">
              {speech}
            </div>
          </div>
        </div>
      )}
      {glitchFx && !ocAura && (
        <div
          className="fixed z-30 pointer-events-none"
          style={{
            left: fxPos.x - 10,
            top: fxPos.y - 10,
            width: SPW * SCALE + 20,
            height: SPH * SCALE + 20,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
              animation: 'glow-pulse 0.3s ease-in-out infinite alternate',
            }}
          />
        </div>
      )}
      {ocAura && (
        <div
          className="fixed z-30 pointer-events-none"
          style={{
            left: fxPos.x - 20,
            top: fxPos.y - 25,
            width: SPW * SCALE + 40,
            height: SPH * SCALE + 50,
          }}
        >
          <div
            className="w-full h-full rounded-full animate-pulse"
            style={{
              background:
                'radial-gradient(ellipse, rgba(255,45,123,0.2) 0%, rgba(245,255,0,0.05) 50%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse, rgba(255,45,123,0.1) 0%, transparent 60%)',
              animation: 'glow-pulse 0.2s ease-in-out infinite alternate',
              transform: 'scale(1.3)',
            }}
          />
        </div>
      )}
    </>
  );
}
