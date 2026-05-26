import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const x = 0;
const H = 1; // hair (cyan)
const K = 2; // outline
const S = 3; // skin
const C = 4; // clothes
const B = 5; // clothes dark
const A = 6; // accent (pink)
const W = 7; // shoes

const PALETTE: Record<number, string> = {
  [x]: '',
  [H]: '#00f5ff',
  [K]: '#0a0a0f',
  [S]: '#e8d0c0',
  [C]: '#1a1a2e',
  [B]: '#12121a',
  [A]: '#ff2d7b',
  [W]: '#c8c8d0',
};

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
  [x,x,x,x,x,K,W,x,W,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,W,x,W,K,x,x,x,x,x,x],
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
  [x,x,x,K,W,x,x,x,x,x,W,K,x,x,x,x],
  [x,x,x,K,W,x,x,x,x,x,W,K,x,x,x,x],
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
  [x,x,x,K,W,x,x,x,x,x,W,K,x,x,x,x],
  [x,x,x,K,W,x,x,x,x,x,W,K,x,x,x,x],
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
  [x,x,x,x,x,K,W,x,W,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,W,x,W,K,x,x,x,x,x,x],
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
  [x,x,x,x,x,K,W,x,W,K,x,x,x,x,x,x],
  [x,x,x,x,x,K,W,x,W,K,x,x,x,x,x,x],
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
  [x,x,x,x,B,W,W,x,W,W,B,x,x,x,x,x],
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
  | 'entering'
  | 'walking'
  | 'idle'
  | 'waving'
  | 'powerup'
  | 'narutorun'
  | 'sleeping'
  | 'sitting'
  | 'fleeing'
  | 'jumping'
  | 'exiting';

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

function mirrorFrame(frame: number[][]): number[][] {
  return frame.map((row) => [...row].reverse());
}

export default function PixelMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const [speech, setSpeech] = useState('');
  const [speechPos, setSpeechPos] = useState({ x: 0, y: 0 });
  const [showPowerFx, setShowPowerFx] = useState(false);
  const [powerPos, setPowerPos] = useState({ x: 0, y: 0 });
  const routeRef = useRef(location.pathname);

  useEffect(() => {
    routeRef.current = location.pathname;
  }, [location.pathname]);

  const drawSprite = useCallback(
    (ctx: CanvasRenderingContext2D, frame: number[][], flip: boolean) => {
      const data = flip ? mirrorFrame(frame) : frame;
      ctx.clearRect(0, 0, SPW * SCALE, SPH * SCALE);
      for (let row = 0; row < SPH; row++) {
        for (let col = 0; col < SPW; col++) {
          const pixel = data[row][col];
          if (pixel === x) continue;
          ctx.fillStyle = PALETTE[pixel];
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
      s.posX = s.direction === 1 ? -sprW : window.innerWidth + sprW;
      s.posY = platYPos(p);
      s.behavior = 'entering';
      s.speed = 1.2;
      s.timer = 999;
      s.visible = true;
      s.behaviorsThisVisit = 0;
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
        if (Math.random() < 0.5) {
          showSpeech(
            IDLE_SPEECH[Math.floor(Math.random() * IDLE_SPEECH.length)],
          );
        }
      } else if (roll < 0.4) {
        s.behavior = 'waving';
        s.timer = 45;
        showSpeech('hey! ✧');
      } else if (roll < 0.48) {
        s.behavior = 'powerup';
        s.timer = 65;
        showSpeech('HAAA!!', 55);
        setShowPowerFx(true);
        setPowerPos({ x: s.posX, y: s.posY });
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
        s.behavior = 'exiting';
        s.direction = Math.random() < 0.5 ? -1 : 1;
        s.speed = 1.5;
        s.timer = 999;
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

    const loop = setInterval(() => {
      s.tick++;

      // Offscreen: wait, then enter
      if (s.behavior === 'offscreen') {
        s.timer--;
        canvas.style.opacity = '0';
        if (s.timer <= 0) pickEntrance();
        return;
      }

      canvas.style.opacity = '1';
      const plats = getPlatformsForRoute();
      const curPlat = plats[s.platform] || plats[0];

      // Cursor flee
      if (
        s.behavior !== 'jumping' &&
        s.behavior !== 'exiting' &&
        s.behavior !== 'entering'
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

      // Entering
      if (s.behavior === 'entering') {
        s.posX += s.direction * s.speed;
        const left = platLeft(curPlat);
        const right = platRight(curPlat);
        const targetX = left + (right - left) * (0.2 + Math.random() * 0.6);
        if (
          (s.direction === 1 && s.posX >= targetX) ||
          (s.direction === -1 && s.posX <= targetX)
        ) {
          s.behavior = 'idle';
          s.timer = 30 + Math.random() * 40;
        }
      }

      // Exiting
      if (s.behavior === 'exiting') {
        s.posX += s.direction * s.speed;
        if (s.posX < -sprW - 20 || s.posX > window.innerWidth + 20) {
          s.behavior = 'offscreen';
          s.timer = 150 + Math.random() * 250;
          s.visible = false;
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

      // Timer
      if (
        s.behavior !== 'offscreen' &&
        s.behavior !== 'entering' &&
        s.behavior !== 'exiting' &&
        s.behavior !== 'jumping'
      ) {
        s.timer--;
        if (s.timer <= 0) pickBehavior();
      }

      // Speech
      if (s.speechTimer > 0) {
        s.speechTimer--;
        setSpeechPos({ x: s.posX + sprW / 2, y: s.posY - 8 });
        if (s.speechTimer <= 0) {
          setSpeech('');
          setShowPowerFx(false);
        }
      }

      // Sprite selection
      let sprite: number[][];
      const flip = s.direction === -1;

      switch (s.behavior) {
        case 'walking':
        case 'entering':
        case 'exiting':
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
        default:
          sprite = STAND;
      }

      canvas.style.transform = `translate(${Math.round(s.posX)}px, ${Math.round(s.posY)}px)`;
      drawSprite(ctx, sprite, flip);
    }, 1000 / 20);

    return () => {
      clearInterval(loop);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [drawSprite]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={SPW * SCALE}
        height={SPH * SCALE}
        className="fixed top-0 left-0 z-40 pointer-events-none opacity-0 transition-opacity duration-500"
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
            width: SPW * SCALE + 30,
            height: SPH * SCALE + 30,
          }}
        >
          <div className="w-full h-full rounded-full bg-cyber-yellow/10 animate-ping" />
        </div>
      )}
    </>
  );
}
