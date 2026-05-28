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
import type { MascotConfig, TickInput } from '@/mascot/types';

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

export default function PixelMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const [speech, setSpeech] = useState('');
  const [speechPos, setSpeechPos] = useState({ x: 0, y: 0 });
  const [showPowerFx, setShowPowerFx] = useState(false);
  const [powerPos, setPowerPos] = useState({ x: 0, y: 0 });

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
    let state = createInitialState(
      CONFIG,
      100 + Math.floor(Math.random() * 200),
    );
    let platforms = getPagePlatforms(location.pathname, window.innerHeight);
    let mouseX = -9999;
    let mouseY = -9999;
    let clicked = false;

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onClick = () => {
      clicked = true;
    };
    const onResize = () => {
      platforms = getPagePlatforms(location.pathname, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouse);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onClick);
    window.addEventListener('resize', onResize);

    const loop = setInterval(() => {
      const input: TickInput = {
        mouseX,
        mouseY,
        clicked,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        platforms,
        random: Math.random,
      };
      clicked = false;

      const result = tick(state, input, CONFIG);
      state = result.state;

      if (result.effects.speech !== null) {
        setSpeech(result.effects.speech);
      }
      if (state.speechTimer <= 0 && speech) {
        setSpeech('');
      }
      setShowPowerFx(result.effects.showPowerFx);
      if (result.effects.powerFxPosition) {
        setPowerPos(result.effects.powerFxPosition);
      }

      if (!state.visible) {
        canvas.style.left = '-200px';
        canvas.style.top = '-200px';
        return;
      }

      canvas.style.left = `${Math.round(state.x)}px`;
      canvas.style.top = `${Math.round(state.y)}px`;
      setSpeechPos({ x: state.x + sprW / 2, y: state.y - 8 });

      const { spriteKey, flip } = selectSprite(state);
      const frame = getSpriteFrame(spriteKey);
      render(ctx, frame, flip);
    }, 1000 / FPS);

    return () => {
      clearInterval(loop);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onClick);
    };
  }, [location.pathname, render, speech]);

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
            left: powerPos.x - 10,
            top: powerPos.y - 10,
            width: SW * SCALE + 20,
            height: SH * SCALE + 20,
          }}
        >
          <div className="w-full h-full rounded-full bg-cyber-yellow/10 animate-ping" />
        </div>
      )}
    </>
  );
}
