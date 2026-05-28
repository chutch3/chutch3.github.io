export type Behavior =
  | 'offscreen'
  | 'entering'
  | 'walking'
  | 'idle'
  | 'waving'
  | 'sleeping'
  | 'powerup'
  | 'fleeing'
  | 'jumping'
  | 'exiting'
  | 'tumbling'
  | 'bored'
  | 'startled';

export type PaletteIndex = number;
export type SpriteFrame = PaletteIndex[][];
export type SpriteKey =
  | 'stand'
  | 'walkR'
  | 'walkL'
  | 'sit'
  | 'wave1'
  | 'wave2'
  | 'saiyan';

export interface Platform {
  y: number;
  xMin: number;
  xMax: number;
}

export interface MascotConfig {
  spriteWidth: number;
  spriteHeight: number;
  walkSpeed: number;
  fleeSpeed: number;
  exitSpeed: number;
  cursorFleeRadius: number;
  gravity: number;
  initialJumpVy: number;
}

export interface MascotState {
  x: number;
  y: number;
  platform: number;
  behavior: Behavior;
  direction: 1 | -1;
  tick: number;
  timer: number;
  speed: number;
  jumpVy: number;
  jumpTargetPlat: number;
  jumpTargetX: number;
  speechTimer: number;
  sleepBubbleGrow: number;
  visible: boolean;
  clickCount: number;
  clickDecay: number;
  rotation: number;
  tumbleSpin: number;
  justLanded: boolean;
}

export interface TickInput {
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  viewportWidth: number;
  viewportHeight: number;
  platforms: Platform[];
  random: () => number;
  scrollVelocity: number;
  userIdleTicks: number;
  mouseMoved: boolean;
  route: string;
}

export interface DustParticle {
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  life: number;
}

export interface TickEffects {
  speech: string | null;
  speechDuration: number;
  showPowerFx: boolean;
  powerFxPosition: { x: number; y: number } | null;
  landingDust: { x: number; y: number; particles: DustParticle[] } | null;
  powerUpParticles: {
    x: number;
    y: number;
    particles: DustParticle[];
  } | null;
}

export interface TickResult {
  state: MascotState;
  effects: TickEffects;
}
