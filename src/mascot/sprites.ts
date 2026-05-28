import type { SpriteFrame, SpriteKey } from './types';

const P = 0;
const H = 1;
const K = 2;
const S = 3;
const C = 4;
const B = 5;
const A = 6;
const W = 7;

export const PALETTE: Record<number, string> = {
  [P]: '',
  [H]: '#00f5ff',
  [K]: '#0a0a0f',
  [S]: '#e8d0c0',
  [C]: '#1a1a2e',
  [B]: '#12121a',
  [A]: '#ff2d7b',
  [W]: '#c8c8d0',
};

export const SCALE = 3;
export const SW = 16;
export const SH = 22;

/* prettier-ignore */
export const STAND: SpriteFrame = [
  [P,P,P,P,P,H,H,H,H,H,H,P,P,P,P,P],
  [P,P,P,P,H,H,H,H,H,H,H,H,P,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,K,S,S,S,S,S,S,S,S,K,P,P,P],
  [P,P,P,S,S,K,S,S,S,K,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,A,S,S,S,S,S,P,P,P],
  [P,P,P,P,K,S,S,S,S,S,K,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,K,C,C,C,C,C,K,P,P,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,S,P,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,S,P,P,P,P],
  [P,P,P,S,P,K,C,C,C,K,P,S,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,P,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,P,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,B,C,P,C,B,P,P,P,P,P,P],
  [P,P,P,P,P,K,W,P,W,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,W,P,W,K,P,P,P,P,P,P],
  [P,P,P,P,K,K,K,P,K,K,K,P,P,P,P,P],
];

/* prettier-ignore */
export const WALK_R: SpriteFrame = [
  [P,P,P,P,P,H,H,H,H,H,H,P,P,P,P,P],
  [P,P,P,P,H,H,H,H,H,H,H,H,P,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,K,S,S,S,S,S,S,S,S,K,P,P,P],
  [P,P,P,S,S,K,S,S,S,K,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,A,S,S,S,S,S,P,P,P],
  [P,P,P,P,K,S,S,S,S,S,K,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,P,P,P,P,P],
  [P,P,S,P,K,C,C,C,C,C,K,S,P,P,P,P],
  [P,P,P,P,K,C,C,C,C,C,K,P,S,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,K,C,P,P,P,C,K,P,P,P,P,P],
  [P,P,P,P,B,C,P,P,P,C,B,P,P,P,P,P],
  [P,P,P,K,W,P,P,P,P,P,W,K,P,P,P,P],
  [P,P,P,K,W,P,P,P,P,P,W,K,P,P,P,P],
  [P,P,K,K,K,P,P,P,P,K,K,K,P,P,P,P],
  [P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P],
];

/* prettier-ignore */
export const WALK_L: SpriteFrame = [
  [P,P,P,P,P,H,H,H,H,H,H,P,P,P,P,P],
  [P,P,P,P,H,H,H,H,H,H,H,H,P,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,K,S,S,S,S,S,S,S,S,K,P,P,P],
  [P,P,P,S,S,K,S,S,S,K,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,A,S,S,S,S,S,P,P,P],
  [P,P,P,P,K,S,S,S,S,S,K,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,K,C,C,C,C,C,K,S,P,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,P,S,P,P,P],
  [P,P,S,P,K,C,C,C,C,C,K,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,K,C,P,P,P,C,K,P,P,P,P,P],
  [P,P,P,P,B,C,P,P,P,C,B,P,P,P,P,P],
  [P,P,P,K,W,P,P,P,P,P,W,K,P,P,P,P],
  [P,P,P,K,W,P,P,P,P,P,W,K,P,P,P,P],
  [P,P,K,K,K,P,P,P,P,K,K,K,P,P,P,P],
  [P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P],
];

/* prettier-ignore */
export const SIT: SpriteFrame = [
  [P,P,P,P,P,H,H,H,H,H,H,P,P,P,P,P],
  [P,P,P,P,H,H,H,H,H,H,H,H,P,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,K,S,S,S,S,S,S,S,S,K,P,P,P],
  [P,P,P,S,S,K,S,S,S,K,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,S,S,S,P,P,P],
  [P,P,P,P,K,S,S,S,S,S,K,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,K,C,C,C,C,C,K,P,P,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,S,P,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,S,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,K,C,C,C,C,C,K,P,P,P,P,P],
  [P,P,P,K,W,C,C,C,C,C,W,K,P,P,P,P],
  [P,P,P,K,W,W,W,P,W,W,W,K,P,P,P,P],
  [P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P],
  [P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P],
  [P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P],
  [P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P],
  [P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P],
];

/* prettier-ignore */
export const WAVE_1: SpriteFrame = [
  [P,P,P,P,P,H,H,H,H,H,H,P,P,P,P,P],
  [P,P,P,P,H,H,H,H,H,H,H,H,P,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,K,S,S,S,S,S,S,S,S,K,P,P,P],
  [P,P,P,S,S,K,S,S,S,K,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,A,S,S,S,S,S,P,P,P],
  [P,P,P,P,K,S,S,S,S,S,K,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,K,C,C,C,C,C,K,P,S,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,P,S,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,S,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,P,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,P,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,B,C,P,C,B,P,P,P,P,P,P],
  [P,P,P,P,P,K,W,P,W,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,W,P,W,K,P,P,P,P,P,P],
  [P,P,P,P,K,K,K,P,K,K,K,P,P,P,P,P],
];

/* prettier-ignore */
export const WAVE_2: SpriteFrame = [
  [P,P,P,P,P,H,H,H,H,H,H,P,P,P,P,P],
  [P,P,P,P,H,H,H,H,H,H,H,H,P,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,H,H,H,H,H,H,H,H,H,H,P,P,P],
  [P,P,P,K,S,S,S,S,S,S,S,S,K,P,P,P],
  [P,P,P,S,S,K,S,S,S,K,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,S,S,S,P,P,P],
  [P,P,P,S,S,S,S,A,S,S,S,S,S,P,P,P],
  [P,P,P,P,K,S,S,S,S,S,K,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,S,P,P,P],
  [P,P,P,P,K,C,C,C,C,C,K,S,P,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,P,P,P,P,P],
  [P,P,P,S,K,C,C,C,C,C,K,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,C,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,P,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,C,P,C,K,P,P,P,P,P,P],
  [P,P,P,P,P,B,C,P,C,B,P,P,P,P,P,P],
  [P,P,P,P,P,K,W,P,W,K,P,P,P,P,P,P],
  [P,P,P,P,P,K,W,P,W,K,P,P,P,P,P,P],
  [P,P,P,P,K,K,K,P,K,K,K,P,P,P,P,P],
];

export const WALK_FRAMES: SpriteFrame[] = [STAND, WALK_R, STAND, WALK_L];
export const WAVE_FRAMES: SpriteFrame[] = [WAVE_1, WAVE_2];

export const SPEECH = [
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

export const CLICK_SPEECH = [
  'NANI?!',
  'oi!',
  'やめて!',
  '(╯°□°)╯',
  'hey!!',
  '!?',
];

export function mirror(frame: SpriteFrame): SpriteFrame {
  return frame.map((row) => [...row].reverse());
}

const SPRITE_MAP: Record<SpriteKey, SpriteFrame> = {
  stand: STAND,
  walkR: WALK_R,
  walkL: WALK_L,
  sit: SIT,
  wave1: WAVE_1,
  wave2: WAVE_2,
};

export function getSpriteFrame(key: SpriteKey): SpriteFrame {
  return SPRITE_MAP[key];
}
