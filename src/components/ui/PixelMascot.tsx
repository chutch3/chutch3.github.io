import { useEffect, useRef, useCallback, useState } from 'react';

const P = 0; // transparent
const H = 1; // hair (cyan)
const O = 2; // outline (dark)
const S = 3; // skin
const C = 4; // clothes
const E = 5; // eyes
const A = 6; // accent (pink)
const Y = 7; // yellow (power up)

const PALETTE: Record<number, string> = {
  [P]: '',
  [H]: '#00f5ff',
  [O]: '#0a0a0f',
  [S]: '#e0d0c8',
  [C]: '#1a1a2e',
  [E]: '#0a0a0f',
  [A]: '#ff2d7b',
  [Y]: '#f5ff00',
};

const SCALE = 3;
const W = 14;
const HT = 18;

// Sprite frames: each is a HT x W grid
const IDLE_1 = [
  [P, P, P, P, P, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, O, S, S, S, S, S, S, S, S, O, P, P],
  [P, P, S, S, E, S, S, S, E, S, S, S, P, P],
  [P, P, S, S, S, S, S, S, S, S, S, S, P, P],
  [P, P, S, S, S, S, A, S, S, S, S, S, P, P],
  [P, P, P, O, S, S, S, S, S, O, P, P, P, P],
  [P, P, P, P, O, C, C, C, O, P, P, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, P, S, O, C, C, C, O, S, P, P, P, P],
  [P, P, P, S, P, O, O, O, P, S, P, P, P, P],
  [P, P, P, O, P, P, P, P, P, O, P, P, P, P],
  [P, P, O, O, P, P, P, P, P, O, O, P, P, P],
];

const IDLE_2 = [
  [P, P, P, P, P, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, O, S, S, S, S, S, S, S, S, O, P, P],
  [P, P, S, S, E, S, S, S, E, S, S, S, P, P],
  [P, P, S, S, S, S, S, S, S, S, S, S, P, P],
  [P, P, S, S, S, S, S, S, S, S, S, S, P, P],
  [P, P, P, O, S, S, S, S, S, O, P, P, P, P],
  [P, P, P, P, O, C, C, C, O, P, P, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, P, S, O, C, C, C, O, S, P, P, P, P],
  [P, P, P, S, P, O, O, O, P, S, P, P, P, P],
  [P, P, P, O, P, P, P, P, P, O, P, P, P, P],
  [P, P, O, O, P, P, P, P, P, O, O, P, P, P],
];

const WALK_1 = [
  [P, P, P, P, P, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, O, S, S, S, S, S, S, S, S, O, P, P],
  [P, P, S, S, E, S, S, S, E, S, S, S, P, P],
  [P, P, S, S, S, S, S, S, S, S, S, S, P, P],
  [P, P, S, S, S, S, A, S, S, S, S, S, P, P],
  [P, P, P, O, S, S, S, S, S, O, P, P, P, P],
  [P, P, P, P, O, C, C, C, O, P, P, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, P, P, O, C, C, O, S, P, P, P, P, P],
  [P, P, P, S, P, O, O, P, O, P, P, P, P, P],
  [P, P, P, O, O, P, P, P, P, O, P, P, P, P],
  [P, P, P, P, P, P, P, P, O, O, P, P, P, P],
];

const WALK_2 = [
  [P, P, P, P, P, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, O, S, S, S, S, S, S, S, S, O, P, P],
  [P, P, S, S, E, S, S, S, E, S, S, S, P, P],
  [P, P, S, S, S, S, S, S, S, S, S, S, P, P],
  [P, P, S, S, S, S, A, S, S, S, S, S, P, P],
  [P, P, P, O, S, S, S, S, S, O, P, P, P, P],
  [P, P, P, P, O, C, C, C, O, P, P, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, P, S, O, C, C, O, P, P, P, P, P, P],
  [P, P, P, P, O, O, O, P, S, P, P, P, P, P],
  [P, P, P, P, O, P, P, O, O, P, P, P, P, P],
  [P, P, P, O, O, P, P, P, P, P, P, P, P, P],
];

// Wave frames - arm raised
const WAVE_1 = [
  [P, P, P, P, P, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, O, S, S, S, S, S, S, S, S, O, P, P],
  [P, P, S, S, O, S, S, S, O, S, S, S, P, P],
  [P, P, S, S, S, S, S, S, S, S, S, S, P, P],
  [P, P, S, S, S, S, A, S, S, S, S, S, P, P],
  [P, P, P, O, S, S, S, S, S, O, P, P, P, P],
  [P, P, P, P, O, C, C, C, O, P, P, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, S, P, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, S, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, S, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, P, S, O, C, C, C, O, S, P, P, P, P],
  [P, P, P, S, P, O, O, O, P, S, P, P, P, P],
  [P, P, P, O, P, P, P, P, P, O, P, P, P, P],
  [P, P, O, O, P, P, P, P, P, O, O, P, P, P],
];

const WAVE_2 = [
  [P, P, P, P, P, H, H, H, H, P, P, P, P, P],
  [P, P, P, P, H, H, H, H, H, H, P, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, P, H, H, H, H, H, H, H, H, P, P, P],
  [P, P, O, S, S, S, S, S, S, S, S, O, P, P],
  [P, P, S, S, O, S, S, S, O, S, S, S, P, P],
  [P, P, S, S, S, S, S, S, S, S, S, S, P, P],
  [P, P, S, S, S, S, A, S, S, S, S, S, P, P],
  [P, P, P, O, S, S, S, S, S, O, P, P, P, P],
  [P, P, P, P, O, C, C, C, O, P, P, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, S, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, S, P, P],
  [P, P, O, C, C, C, C, C, C, C, O, P, P, P],
  [P, P, P, O, C, C, C, C, C, O, P, P, P, P],
  [P, P, P, S, O, C, C, C, O, S, P, P, P, P],
  [P, P, P, S, P, O, O, O, P, S, P, P, P, P],
  [P, P, P, O, P, P, P, P, P, O, P, P, P, P],
  [P, P, O, O, P, P, P, P, P, O, O, P, P, P],
];

type BehaviorState = 'idle' | 'walking' | 'waving' | 'powerup' | 'fleeing';

const SPEECH_BUBBLES = [
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
];

function mirrorFrame(frame: number[][]): number[][] {
  return frame.map((row) => [...row].reverse());
}

export default function PixelMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    x:
      Math.random() *
      (typeof window !== 'undefined' ? window.innerWidth - 100 : 500),
    y: 0,
    behavior: 'idle' as BehaviorState,
    frame: 0,
    tick: 0,
    direction: 1,
    behaviorTimer: 0,
    speechBubble: '',
    speechTimer: 0,
    powerupFrame: 0,
    mouseX: -1000,
    mouseY: -1000,
    groundY: 0,
  });

  const [speech, setSpeech] = useState('');
  const [speechPos, setSpeechPos] = useState({ x: 0, y: 0 });
  const [showPowerFx, setShowPowerFx] = useState(false);
  const [powerPos, setPowerPos] = useState({ x: 0, y: 0 });

  const drawSprite = useCallback(
    (ctx: CanvasRenderingContext2D, frame: number[][], flip: boolean) => {
      const data = flip ? mirrorFrame(frame) : frame;
      ctx.clearRect(0, 0, W * SCALE, HT * SCALE);
      for (let y = 0; y < HT; y++) {
        for (let x = 0; x < W; x++) {
          const pixel = data[y][x];
          if (pixel === P) continue;
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

    const s = stateRef.current;
    s.groundY =
      typeof window !== 'undefined'
        ? window.innerHeight - HT * SCALE - 20
        : 600;
    s.y = s.groundY;

    const onMouseMove = (e: MouseEvent) => {
      s.mouseX = e.clientX;
      s.mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      s.groundY = window.innerHeight - HT * SCALE - 20;
      s.y = s.groundY;
      if (s.x > window.innerWidth - W * SCALE) {
        s.x = window.innerWidth - W * SCALE - 20;
      }
    };
    window.addEventListener('resize', onResize);

    const loop = setInterval(() => {
      s.tick++;

      const charCenterX = s.x + (W * SCALE) / 2;
      const charCenterY = s.y + (HT * SCALE) / 2;
      const dx = s.mouseX - charCenterX;
      const dy = s.mouseY - charCenterY;
      const distToCursor = Math.sqrt(dx * dx + dy * dy);

      // Flee from cursor if close
      if (distToCursor < 120 && s.behavior !== 'powerup') {
        s.behavior = 'fleeing';
        s.direction = dx > 0 ? -1 : 1;
        s.behaviorTimer = 30;
      }

      // Behavior timer
      s.behaviorTimer--;
      if (s.behaviorTimer <= 0 && s.behavior !== 'fleeing') {
        const roll = Math.random();
        if (roll < 0.4) {
          s.behavior = 'idle';
          s.behaviorTimer = 120 + Math.random() * 180;
          if (Math.random() < 0.25) {
            const msg =
              SPEECH_BUBBLES[Math.floor(Math.random() * SPEECH_BUBBLES.length)];
            s.speechBubble = msg;
            s.speechTimer = 80;
            setSpeech(msg);
            setSpeechPos({
              x: s.x + (W * SCALE) / 2,
              y: s.y - 12,
            });
          }
        } else if (roll < 0.85) {
          s.behavior = 'walking';
          s.direction = Math.random() < 0.5 ? -1 : 1;
          s.behaviorTimer = 60 + Math.random() * 120;
        } else if (roll < 0.95) {
          s.behavior = 'waving';
          s.behaviorTimer = 60;
          s.speechBubble = 'hey! ✧';
          s.speechTimer = 50;
          setSpeech('hey! ✧');
          setSpeechPos({
            x: s.x + (W * SCALE) / 2,
            y: s.y - 12,
          });
        } else {
          s.behavior = 'powerup';
          s.behaviorTimer = 80;
          s.powerupFrame = 0;
          s.speechBubble = 'HAAA!!';
          s.speechTimer = 70;
          setSpeech('HAAA!!');
          setSpeechPos({
            x: s.x + (W * SCALE) / 2,
            y: s.y - 12,
          });
          setShowPowerFx(true);
          setPowerPos({ x: s.x, y: s.y });
        }
      }

      if (s.behavior === 'fleeing') {
        s.x += s.direction * 3;
        if (s.behaviorTimer <= 0) {
          s.behavior = 'idle';
          s.behaviorTimer = 60;
        }
      }

      // Movement
      if (s.behavior === 'walking') {
        s.x += s.direction * 1;
      }

      // Bounds
      const maxX = window.innerWidth - W * SCALE - 10;
      if (s.x < 10) {
        s.x = 10;
        s.direction = 1;
      }
      if (s.x > maxX) {
        s.x = maxX;
        s.direction = -1;
      }

      // Speech timer
      if (s.speechTimer > 0) {
        s.speechTimer--;
        setSpeechPos({
          x: s.x + (W * SCALE) / 2,
          y: s.y - 12,
        });
        if (s.speechTimer <= 0) {
          setSpeech('');
          setShowPowerFx(false);
        }
      }

      // Animation frame
      let sprite: number[][];
      const flip = s.direction === -1;

      switch (s.behavior) {
        case 'walking':
        case 'fleeing':
          s.frame = Math.floor(s.tick / 8) % 2;
          sprite = s.frame === 0 ? WALK_1 : WALK_2;
          break;
        case 'waving':
          s.frame = Math.floor(s.tick / 10) % 2;
          sprite = s.frame === 0 ? WAVE_1 : WAVE_2;
          break;
        case 'powerup':
          s.powerupFrame++;
          sprite = s.powerupFrame % 4 < 2 ? IDLE_1 : IDLE_2;
          break;
        default:
          s.frame = Math.floor(s.tick / 30) % 2;
          sprite = s.frame === 0 ? IDLE_1 : IDLE_2;
      }

      // Position canvas
      canvas.style.transform = `translate(${s.x}px, ${s.y}px)`;
      drawSprite(ctx, sprite, flip);
    }, 1000 / 20);

    return () => {
      clearInterval(loop);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [drawSprite]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={W * SCALE}
        height={HT * SCALE}
        className="fixed bottom-0 left-0 z-40 pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />
      {speech && (
        <div
          className="fixed z-40 pointer-events-none transition-opacity duration-300"
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
            left: powerPos.x - 10,
            top: powerPos.y - 10,
            width: W * SCALE + 20,
            height: HT * SCALE + 20,
          }}
        >
          <div className="w-full h-full rounded-full bg-cyber-yellow/10 animate-ping" />
        </div>
      )}
    </>
  );
}
