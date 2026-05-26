import { useEffect, useRef, useState, useCallback } from 'react';

// Color indices
const _ = 0; // transparent
const H = 1; // hair (cyan)
const K = 2; // outline/dark
const S = 3; // skin
const C = 4; // clothes body
const B = 5; // clothes dark
const A = 6; // accent (pink)
const W = 7; // white/shoes

const PALETTE: Record<number, string> = {
  [_]: '',
  [H]: '#00f5ff',
  [K]: '#0a0a0f',
  [S]: '#e8d0c0',
  [C]: '#1a1a2e',
  [B]: '#12121a',
  [A]: '#ff2d7b',
  [W]: '#c8c8d0',
};

const SCALE = 4;
const SW = 16; // sprite width
const SH = 22; // sprite height

// Pokemon-style walk cycle: stand, step-right, stand, step-left
// Character has head, torso, arms, legs clearly defined

const STAND = [
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, K, S, S, S, S, S, S, S, S, K, _, _, _],
  [_, _, _, S, S, K, S, S, S, K, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, S, S, S, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, A, S, S, S, S, S, _, _, _],
  [_, _, _, _, K, S, S, S, S, S, K, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, K, C, C, C, C, C, K, _, _, _, _, _],
  [_, _, _, S, K, C, C, C, C, C, K, S, _, _, _, _],
  [_, _, _, S, K, C, C, C, C, C, K, S, _, _, _, _],
  [_, _, _, S, _, K, C, C, C, K, _, S, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, _, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, _, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, B, C, _, C, B, _, _, _, _, _, _],
  [_, _, _, _, _, K, W, _, W, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, W, _, W, K, _, _, _, _, _, _],
  [_, _, _, _, K, K, K, _, K, K, K, _, _, _, _, _],
];

// Right foot forward, left arm forward
const WALK_R = [
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, K, S, S, S, S, S, S, S, S, K, _, _, _],
  [_, _, _, S, S, K, S, S, S, K, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, S, S, S, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, A, S, S, S, S, S, _, _, _],
  [_, _, _, _, K, S, S, S, S, S, K, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, S, K, C, C, C, C, C, K, _, _, _, _, _],
  [_, _, S, _, K, C, C, C, C, C, K, S, _, _, _, _],
  [_, _, _, _, K, C, C, C, C, C, K, _, S, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, K, C, _, _, _, C, K, _, _, _, _, _],
  [_, _, _, _, B, C, _, _, _, C, B, _, _, _, _, _],
  [_, _, _, K, W, _, _, _, _, _, W, K, _, _, _, _],
  [_, _, _, K, W, _, _, _, _, _, W, K, _, _, _, _],
  [_, _, K, K, K, _, _, _, _, K, K, K, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Left foot forward, right arm forward
const WALK_L = [
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, K, S, S, S, S, S, S, S, S, K, _, _, _],
  [_, _, _, S, S, K, S, S, S, K, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, S, S, S, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, A, S, S, S, S, S, _, _, _],
  [_, _, _, _, K, S, S, S, S, S, K, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, K, C, C, C, C, C, K, S, _, _, _, _],
  [_, _, _, S, K, C, C, C, C, C, K, _, S, _, _, _],
  [_, _, S, _, K, C, C, C, C, C, K, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, K, C, _, _, _, C, K, _, _, _, _, _],
  [_, _, _, _, B, C, _, _, _, C, B, _, _, _, _, _],
  [_, _, _, K, W, _, _, _, _, _, W, K, _, _, _, _],
  [_, _, _, K, W, _, _, _, _, _, W, K, _, _, _, _],
  [_, _, K, K, K, _, _, _, _, K, K, K, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Wave - right arm up
const WAVE_1 = [
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, K, S, S, S, S, S, S, S, S, K, _, _, _],
  [_, _, _, S, S, K, S, S, S, K, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, S, S, S, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, A, S, S, S, S, S, _, _, _],
  [_, _, _, _, K, S, S, S, S, S, K, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, K, C, C, C, C, C, K, _, S, _, _, _],
  [_, _, _, S, K, C, C, C, C, C, K, _, S, _, _, _],
  [_, _, _, S, K, C, C, C, C, C, K, S, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, _, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, _, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, B, C, _, C, B, _, _, _, _, _, _],
  [_, _, _, _, _, K, W, _, W, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, W, _, W, K, _, _, _, _, _, _],
  [_, _, _, _, K, K, K, _, K, K, K, _, _, _, _, _],
];

const WAVE_2 = [
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, K, S, S, S, S, S, S, S, S, K, _, _, _],
  [_, _, _, S, S, K, S, S, S, K, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, S, S, S, S, S, S, _, _, _],
  [_, _, _, S, S, S, S, A, S, S, S, S, S, _, _, _],
  [_, _, _, _, K, S, S, S, S, S, K, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, S, _, _, _],
  [_, _, _, _, K, C, C, C, C, C, K, S, _, _, _, _],
  [_, _, _, S, K, C, C, C, C, C, K, _, _, _, _, _],
  [_, _, _, S, K, C, C, C, C, C, K, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, C, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, _, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, C, _, C, K, _, _, _, _, _, _],
  [_, _, _, _, _, B, C, _, C, B, _, _, _, _, _, _],
  [_, _, _, _, _, K, W, _, W, K, _, _, _, _, _, _],
  [_, _, _, _, _, K, W, _, W, K, _, _, _, _, _, _],
  [_, _, _, _, K, K, K, _, K, K, K, _, _, _, _, _],
];

const WALK_FRAMES = [STAND, WALK_R, STAND, WALK_L];
const WAVE_FRAMES = [WAVE_1, WAVE_2];

type Behavior =
  | 'idle'
  | 'walking'
  | 'waving'
  | 'powerup'
  | 'fleeing'
  | 'jumping'
  | 'offscreen';

const SPEECH = [
  'こんにちは!',
  '...zzZ',
  'NANI?!',
  '>_<',
  '♪♪♪',
  'sugoi~',
  '( ◕‿◕ )',
  'omae wa...',
  '✧*。',
  'yare yare',
  'senpai!',
  '~nyaa',
  'kawaii',
  'gg',
  'brb',
];

interface Platform {
  y: number; // distance from bottom of viewport
  xMin: number; // left edge (fraction of viewport width)
  xMax: number; // right edge (fraction of viewport width)
}

function getPlatforms(): Platform[] {
  return [
    { y: 20, xMin: 0, xMax: 1 }, // ground level
    { y: 180, xMin: 0.05, xMax: 0.4 }, // lower left
    { y: 180, xMin: 0.6, xMax: 0.95 }, // lower right
    { y: 320, xMin: 0.2, xMax: 0.7 }, // mid center
    { y: 440, xMin: 0, xMax: 0.35 }, // upper left
    { y: 440, xMin: 0.65, xMax: 1 }, // upper right
  ];
}

function mirrorFrame(frame: number[][]): number[][] {
  return frame.map((row) => [...row].reverse());
}

export default function PixelMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speech, setSpeech] = useState('');
  const [speechPos, setSpeechPos] = useState({ x: 0, y: 0 });
  const [showPowerFx, setShowPowerFx] = useState(false);
  const [powerPos, setPowerPos] = useState({ x: 0, y: 0 });

  const drawSprite = useCallback(
    (ctx: CanvasRenderingContext2D, frame: number[][], flip: boolean) => {
      const data = flip ? mirrorFrame(frame) : frame;
      ctx.clearRect(0, 0, SW * SCALE, SH * SCALE);
      for (let y = 0; y < SH; y++) {
        for (let x = 0; x < SW; x++) {
          const pixel = data[y][x];
          if (pixel === _) continue;
          ctx.fillStyle = PALETTE[pixel];
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

    const platforms = getPlatforms();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const sprW = SW * SCALE;
    const sprH = SH * SCALE;

    const s = {
      x: 100 + Math.random() * 200,
      y: vh - 20 - sprH,
      platform: 0,
      behavior: 'walking' as Behavior,
      direction: 1,
      frame: 0,
      tick: 0,
      timer: 80 + Math.random() * 60,
      speed: 1.2,
      // jump state
      jumpVy: 0,
      jumpTarget: -1,
      grounded: true,
      // mouse
      mouseX: -1000,
      mouseY: -1000,
      // speech
      speechTimer: 0,
    };

    function platLeft(p: Platform) {
      return p.xMin * vw;
    }

    function platRight(p: Platform) {
      return p.xMax * vw - sprW;
    }

    const onMouse = (e: MouseEvent) => {
      s.mouseX = e.clientX;
      s.mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouse);

    const onResize = () => {
      const newVw = window.innerWidth;
      const newVh = window.innerHeight;
      const plat = platforms[s.platform];
      s.y = newVh - plat.y - sprH;
      if (s.x > plat.xMax * newVw - sprW) s.x = plat.xMax * newVw - sprW;
      if (s.x < plat.xMin * newVw) s.x = plat.xMin * newVw;
    };
    window.addEventListener('resize', onResize);

    const loop = setInterval(() => {
      s.tick++;
      const curPlat = platforms[s.platform];
      const cw = window.innerWidth;
      const ch = window.innerHeight;

      // Cursor flee
      const cx = s.x + sprW / 2;
      const cy = s.y + sprH / 2;
      const dx = s.mouseX - cx;
      const dy = s.mouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (
        dist < 130 &&
        s.behavior !== 'powerup' &&
        s.behavior !== 'jumping' &&
        s.behavior !== 'offscreen'
      ) {
        s.behavior = 'fleeing';
        s.direction = dx > 0 ? -1 : 1;
        s.timer = 25;
        s.speed = 2.5;
      }

      // Behavior timer
      if (s.behavior !== 'jumping' && s.behavior !== 'offscreen') {
        s.timer--;
        if (s.timer <= 0) {
          const roll = Math.random();
          s.speed = 1.2;
          if (roll < 0.3) {
            s.behavior = 'idle';
            s.timer = 80 + Math.random() * 120;
            if (Math.random() < 0.3) {
              const msg = SPEECH[Math.floor(Math.random() * SPEECH.length)];
              setSpeech(msg);
              s.speechTimer = 70;
            }
          } else if (roll < 0.65) {
            s.behavior = 'walking';
            s.direction = Math.random() < 0.5 ? -1 : 1;
            s.timer = 80 + Math.random() * 150;
          } else if (roll < 0.75) {
            s.behavior = 'waving';
            s.timer = 50;
            setSpeech('hey! ✧');
            s.speechTimer = 45;
          } else if (roll < 0.82) {
            s.behavior = 'powerup';
            s.timer = 70;
            setSpeech('HAAA!!');
            s.speechTimer = 60;
            setShowPowerFx(true);
            setPowerPos({ x: s.x, y: s.y });
          } else if (roll < 0.92) {
            // Jump to another platform
            const others = platforms
              .map((_, i) => i)
              .filter((i) => i !== s.platform);
            const target = others[Math.floor(Math.random() * others.length)];
            s.behavior = 'jumping';
            s.jumpTarget = target;
            s.jumpVy = -8;
            s.grounded = false;
          } else {
            // Walk offscreen
            s.behavior = 'offscreen';
            s.direction = Math.random() < 0.5 ? -1 : 1;
            s.timer = 999;
            s.speed = 1.5;
          }
        }
      }

      // Movement
      if (
        s.behavior === 'walking' ||
        s.behavior === 'fleeing' ||
        s.behavior === 'offscreen'
      ) {
        s.x += s.direction * s.speed;
      }

      // Platform bounds for walking/fleeing
      if (s.behavior === 'walking' || s.behavior === 'fleeing') {
        const left = platLeft(curPlat);
        const right = platRight(curPlat);
        if (s.x <= left) {
          s.x = left;
          s.direction = 1;
        }
        if (s.x >= right) {
          s.x = right;
          s.direction = -1;
        }
      }

      // Offscreen logic
      if (s.behavior === 'offscreen') {
        if (s.x < -sprW - 20 || s.x > cw + 20) {
          // Reappear on a random platform from the opposite side
          const newPlat = Math.floor(Math.random() * platforms.length);
          s.platform = newPlat;
          const p = platforms[newPlat];
          s.y = ch - p.y - sprH;
          s.direction = s.x < 0 ? 1 : -1;
          s.x = s.direction === 1 ? p.xMin * cw - sprW : p.xMax * cw;
          s.behavior = 'walking';
          s.timer = 60 + Math.random() * 100;
          s.speed = 1.2;
        }
      }

      // Jump physics
      if (s.behavior === 'jumping') {
        const targetPlat = platforms[s.jumpTarget];
        const targetY = ch - targetPlat.y - sprH;
        const targetX =
          platLeft(targetPlat) +
          (platRight(targetPlat) - platLeft(targetPlat)) *
            (0.3 + Math.random() * 0.4);

        s.jumpVy += 0.35;
        s.y += s.jumpVy;
        // Move horizontally toward target
        const dxj = targetX - s.x;
        s.x += dxj * 0.04;
        s.direction = dxj > 0 ? 1 : -1;

        if (s.jumpVy > 0 && s.y >= targetY) {
          s.y = targetY;
          s.platform = s.jumpTarget;
          s.grounded = true;
          s.behavior = 'idle';
          s.timer = 30 + Math.random() * 40;
          s.jumpVy = 0;
        }
      }

      // Speech timer
      if (s.speechTimer > 0) {
        s.speechTimer--;
        setSpeechPos({ x: s.x + sprW / 2, y: s.y - 8 });
        if (s.speechTimer <= 0) {
          setSpeech('');
          setShowPowerFx(false);
        }
      }

      // Select animation frame
      let sprite: number[][];
      const flip = s.direction === -1;

      switch (s.behavior) {
        case 'walking':
        case 'fleeing':
        case 'offscreen':
          sprite = WALK_FRAMES[Math.floor(s.tick / 6) % 4];
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
        default:
          sprite = STAND;
      }

      canvas.style.transform = `translate(${Math.round(s.x)}px, ${Math.round(s.y)}px)`;
      drawSprite(ctx, sprite, flip);
    }, 1000 / 20);

    return () => {
      clearInterval(loop);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
    };
  }, [drawSprite]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={SW * SCALE}
        height={SH * SCALE}
        className="fixed top-0 left-0 z-40 pointer-events-none"
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
