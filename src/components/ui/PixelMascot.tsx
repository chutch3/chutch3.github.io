import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { createInitialState, tick, selectSprite } from '@/mascot/state-machine';
import { getPagePlatforms } from '@/mascot/platforms';
import {
  getSpriteFrame,
  mirror,
  PALETTE,
  SCALE,
  SW,
  SH,
} from '@/mascot/sprites';
import { drawSprite } from '@/mascot/renderer';
import type {
  MascotConfig,
  MascotState,
  TickInput,
  DustParticle,
  Platform,
} from '@/mascot/types';

const CONFIG: MascotConfig = {
  spriteWidth: SW * SCALE,
  spriteHeight: SH * SCALE,
  walkSpeed: 1.2,
  fleeSpeed: 3,
  exitSpeed: 1.5,
  cursorFleeRadius: 110,
  gravity: 0.4,
  initialJumpVy: -9,
};

const FPS = 20;
const DUST_GRAVITY = 0.15;
const ENERGY_DECAY_VY = -0.02;
const POWERUP_PARTICLE_LIMIT = 80;

interface DustInstance extends DustParticle {
  id: number;
  originX: number;
  originY: number;
}

interface EnergyInstance extends DustParticle {
  id: number;
  originX: number;
  originY: number;
}

export default function PixelMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const [speech, setSpeech] = useState('');
  const [speechPos, setSpeechPos] = useState({ x: 0, y: 0 });
  const [showPowerFx, setShowPowerFx] = useState(false);
  const [powerPos, setPowerPos] = useState({ x: 0, y: 0 });
  const [dust, setDust] = useState<DustInstance[]>([]);
  const [energy, setEnergy] = useState<EnergyInstance[]>([]);

  // Refs persist mascot state across route changes so the character does not
  // disappear and reset to offscreen on every navigation.
  const stateRef = useRef<MascotState | null>(null);
  const platformsRef = useRef<Platform[]>([]);
  const routeRef = useRef(location.pathname);

  // Keep platforms and route in sync with the current route, without resetting
  // the rest of the mascot state.
  useEffect(() => {
    routeRef.current = location.pathname;
    platformsRef.current = getPagePlatforms(
      location.pathname,
      window.innerHeight,
    );
  }, [location.pathname]);

  const render = useCallback(
    (ctx: CanvasRenderingContext2D, frame: number[][], flip: boolean) => {
      const data = flip ? mirror(frame) : frame;
      drawSprite(ctx, data, PALETTE, SCALE, SW, SH);
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sprW = CONFIG.spriteWidth;
    if (!stateRef.current) {
      stateRef.current = createInitialState(
        CONFIG,
        100 + Math.floor(Math.random() * 200),
      );
    }
    if (platformsRef.current.length === 0) {
      platformsRef.current = getPagePlatforms(
        routeRef.current,
        window.innerHeight,
      );
    }

    let mouseX = -9999;
    let mouseY = -9999;
    let clicked = false;
    let mouseMoved = false;
    let userIdleTicks = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let dustIdCounter = 0;
    let energyIdCounter = 0;

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseMoved = true;
      userIdleTicks = 0;
    };
    const onClick = () => {
      clicked = true;
      mouseMoved = true;
      userIdleTicks = 0;
    };
    const onScroll = () => {
      const y = window.scrollY;
      // Accumulate so multiple scroll events between ticks sum up. Mobile
      // browsers fire scroll events more frequently with smaller deltas, so
      // replacing (instead of accumulating) would never cross the threshold.
      scrollVelocity += y - lastScrollY;
      lastScrollY = y;
    };
    const onResize = () => {
      platformsRef.current = getPagePlatforms(
        routeRef.current,
        window.innerHeight,
      );
    };

    window.addEventListener('mousemove', onMouse);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const loop = setInterval(() => {
      const state = stateRef.current!;
      const input: TickInput = {
        mouseX,
        mouseY,
        clicked,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        platforms: platformsRef.current,
        random: Math.random,
        scrollVelocity,
        userIdleTicks,
        mouseMoved,
        route: routeRef.current,
      };
      clicked = false;
      mouseMoved = false;
      scrollVelocity = 0;
      userIdleTicks++;

      const result = tick(state, input, CONFIG);
      stateRef.current = result.state;
      const next = result.state;

      if (result.effects.speech !== null) {
        setSpeech(result.effects.speech);
      } else if (next.speechTimer <= 0) {
        setSpeech((prev) => (prev ? '' : prev));
      }
      setShowPowerFx(result.effects.showPowerFx);
      if (result.effects.powerFxPosition) {
        setPowerPos(result.effects.powerFxPosition);
      }

      // Spawn new dust particles and advance physics
      if (result.effects.landingDust) {
        const ld = result.effects.landingDust;
        const newDust: DustInstance[] = ld.particles.map((p) => ({
          ...p,
          id: dustIdCounter++,
          originX: ld.x,
          originY: ld.y,
        }));
        setDust((prev) => [...advanceDust(prev), ...newDust]);
      } else {
        setDust((prev) => advanceDust(prev));
      }

      // Spawn/advance powerup energy particles
      if (result.effects.powerUpParticles) {
        const up = result.effects.powerUpParticles;
        const newEnergy: EnergyInstance[] = up.particles.map((p) => ({
          ...p,
          id: energyIdCounter++,
          originX: up.x,
          originY: up.y,
        }));
        setEnergy((prev) =>
          [...advanceEnergy(prev), ...newEnergy].slice(-POWERUP_PARTICLE_LIMIT),
        );
      } else {
        setEnergy((prev) => advanceEnergy(prev));
      }

      if (!next.visible) {
        canvas.style.left = '-200px';
        canvas.style.top = '-200px';
        canvas.style.transform = '';
        return;
      }

      canvas.style.left = `${Math.round(next.x)}px`;
      canvas.style.top = `${Math.round(next.y)}px`;
      canvas.style.transform = next.rotation
        ? `rotate(${next.rotation}rad)`
        : '';
      setSpeechPos({ x: next.x + sprW / 2, y: next.y - 8 });

      const { spriteKey, flip } = selectSprite(next);
      const frame = getSpriteFrame(spriteKey);
      render(ctx, frame, flip);
    }, 1000 / FPS);

    return () => {
      clearInterval(loop);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onClick);
    };
  }, [render]);

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
        <>
          <div
            className="fixed z-20 pointer-events-none"
            style={{
              left: powerPos.x - 30,
              top: powerPos.y - 30,
              width: SW * SCALE + 60,
              height: SH * SCALE + 60,
            }}
          >
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background:
                  'radial-gradient(circle, rgba(245,255,0,0.35), rgba(255,45,123,0.15) 60%, transparent 75%)',
              }}
            />
          </div>
          <div
            className="fixed z-20 pointer-events-none"
            style={{
              left: powerPos.x + (SW * SCALE) / 2 - 1,
              top: powerPos.y + SH * SCALE - 2,
              width: 2,
              height: 800,
              background:
                'linear-gradient(to top, rgba(245,255,0,0.7), rgba(255,45,123,0.3) 30%, transparent 70%)',
              filter: 'blur(1px)',
            }}
          />
        </>
      )}
      {energy.map((p) => (
        <div
          key={p.id}
          className="fixed z-30 pointer-events-none"
          style={{
            left: p.originX + p.dx,
            top: p.originY + p.dy,
            width: 3,
            height: 6 + Math.max(0, 18 - p.life),
            background: '#f5ff00',
            boxShadow: '0 0 4px #f5ff00, 0 0 8px #ff2d7b',
            opacity: Math.min(1, p.life / 12),
          }}
        />
      ))}
      {dust.map((p) => (
        <div
          key={p.id}
          className="fixed z-30 pointer-events-none"
          style={{
            left: p.originX + p.dx,
            top: p.originY + p.dy,
            width: 4,
            height: 4,
            background: '#c8c8d0',
            opacity: p.life / 20,
          }}
        />
      ))}
    </>
  );
}

function advanceDust(particles: DustInstance[]): DustInstance[] {
  return particles
    .map((p) => ({
      ...p,
      dx: p.dx + p.vx,
      dy: p.dy + p.vy,
      vy: p.vy + DUST_GRAVITY,
      life: p.life - 1,
    }))
    .filter((p) => p.life > 0);
}

function advanceEnergy(particles: EnergyInstance[]): EnergyInstance[] {
  // Rising particles accelerate slightly upward then fade.
  return particles
    .map((p) => ({
      ...p,
      dx: p.dx + p.vx,
      dy: p.dy + p.vy,
      vy: p.vy + ENERGY_DECAY_VY,
      life: p.life - 1,
    }))
    .filter((p) => p.life > 0);
}
