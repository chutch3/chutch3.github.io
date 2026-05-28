import type {
  MascotConfig,
  MascotState,
  TickInput,
  TickEffects,
  TickResult,
  SpriteKey,
  Platform,
} from './types';

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

const CLICK_SPEECH = ['NANI?!', 'oi!', 'やめて!', '(╯°□°)╯', 'hey!!', '!?'];

function platY(p: Platform, vh: number, sprH: number): number {
  return vh - p.y - sprH;
}

function platL(p: Platform, vw: number): number {
  return p.xMin * vw;
}

function platR(p: Platform, vw: number, sprW: number): number {
  return p.xMax * vw - sprW;
}

export function createInitialState(
  config: MascotConfig,
  initialTimer: number,
): MascotState {
  return {
    x: -config.spriteWidth - 10,
    y: 0,
    platform: 0,
    behavior: 'offscreen',
    direction: 1,
    tick: 0,
    timer: initialTimer,
    speed: config.walkSpeed,
    jumpVy: 0,
    jumpTargetPlat: 0,
    jumpTargetX: 0,
    speechTimer: 0,
    sleepBubbleGrow: 0,
    visible: false,
    clickCount: 0,
    clickDecay: 0,
  };
}

export function tick(
  prev: MascotState,
  input: TickInput,
  config: MascotConfig,
): TickResult {
  // Clone state to maintain purity
  const s: MascotState = { ...prev };
  s.tick++;

  const { viewportWidth: cw, viewportHeight: vh, platforms } = input;
  const { spriteWidth: sprW, spriteHeight: sprH } = config;
  const curPlat = platforms[s.platform] || platforms[0];

  const effects: TickEffects = {
    speech: null,
    speechDuration: 0,
    showPowerFx: false,
    powerFxPosition: null,
  };

  // ── click decay ──
  if (s.clickDecay > 0) {
    s.clickDecay--;
    if (s.clickDecay <= 0) s.clickCount = 0;
  }

  // ── handle click/tap ──
  if (input.clicked && s.visible && s.behavior !== 'offscreen') {
    s.clickCount++;
    s.clickDecay = 40;
    const speechIdx = Math.floor(input.random() * CLICK_SPEECH.length);
    effects.speech = CLICK_SPEECH[speechIdx];
    effects.speechDuration = 28;
    s.speechTimer = 28;
    s.behavior = 'fleeing';
    s.direction = input.random() < 0.5 ? -1 : 1;
    s.timer = 25;
    s.speed = config.fleeSpeed;
  }

  // ── cursor flee ──
  if (
    s.visible &&
    s.behavior !== 'jumping' &&
    s.behavior !== 'offscreen' &&
    s.behavior !== 'exiting' &&
    s.behavior !== 'entering'
  ) {
    const cx = s.x + sprW / 2;
    const cy = s.y + sprH / 2;
    const dx = input.mouseX - cx;
    const dy = input.mouseY - cy;
    if (Math.sqrt(dx * dx + dy * dy) < config.cursorFleeRadius) {
      s.behavior = 'fleeing';
      s.direction = dx > 0 ? -1 : 1;
      s.timer = 20;
      s.speed = config.fleeSpeed;
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
      s.speed = config.walkSpeed;
      const roll = input.random();
      if (roll < 0.18) {
        // Exit screen
        s.behavior = 'exiting';
        s.direction = input.random() < 0.5 ? -1 : 1;
        s.timer = 999;
        s.speed = config.exitSpeed;
      } else if (roll < 0.38) {
        s.behavior = 'idle';
        s.timer = 60 + input.random() * 100;
        if (input.random() < 0.35) {
          const speechIdx = Math.floor(input.random() * SPEECH.length);
          effects.speech = SPEECH[speechIdx];
          effects.speechDuration = 60;
          s.speechTimer = 60;
        }
      } else if (roll < 0.62) {
        s.behavior = 'walking';
        s.direction = input.random() < 0.5 ? -1 : 1;
        s.timer = 60 + input.random() * 120;
      } else if (roll < 0.72) {
        s.behavior = 'waving';
        s.timer = 50;
        effects.speech = 'hey! ✧';
        effects.speechDuration = 45;
        s.speechTimer = 45;
      } else if (roll < 0.8) {
        s.behavior = 'sleeping';
        s.timer = 100 + input.random() * 80;
        s.sleepBubbleGrow = 0;
      } else if (roll < 0.87) {
        s.behavior = 'powerup';
        s.timer = 70;
        effects.speech = 'HAAA!!';
        effects.speechDuration = 60;
        s.speechTimer = 60;
        effects.showPowerFx = true;
        effects.powerFxPosition = { x: s.x, y: s.y };
      } else if (platforms.length > 1) {
        const others = platforms
          .map((_, i) => i)
          .filter((i) => i !== s.platform);
        const targetIdx = Math.floor(input.random() * others.length);
        const target = others[targetIdx];
        s.behavior = 'jumping';
        s.jumpTargetPlat = target;
        const tl = platL(platforms[target], cw);
        const tr = platR(platforms[target], cw, sprW);
        s.jumpTargetX = tl + (tr - tl) * (0.2 + input.random() * 0.6);
        s.jumpVy = config.initialJumpVy;
      } else {
        s.behavior = 'walking';
        s.direction = input.random() < 0.5 ? -1 : 1;
        s.timer = 80;
      }
    }
  }

  // ── offscreen: wait then enter ──
  if (s.behavior === 'offscreen') {
    s.timer--;
    s.visible = false;
    if (s.timer <= 0) {
      // Pick entrance
      const platIdx = Math.floor(input.random() * platforms.length);
      s.platform = platIdx;
      const p = platforms[platIdx];
      s.direction = input.random() < 0.5 ? 1 : -1;
      const pL = platL(p, cw);
      const pR = platR(p, cw, sprW);
      s.x = s.direction === 1 ? pL - sprW - 5 : pR + sprW + 5;
      s.y = platY(p, vh, sprH);
      s.behavior = 'entering';
      s.speed = config.walkSpeed;
      s.timer = 999;
      s.visible = true;
    }
    return { state: s, effects };
  }

  // ── entering: walk onto platform ──
  if (s.behavior === 'entering') {
    s.x += s.direction * s.speed;
    const l = platL(curPlat, cw);
    const r = platR(curPlat, cw, sprW);
    if (s.x >= l && s.x <= r) {
      s.behavior = 'walking';
      s.timer = 60 + input.random() * 100;
    }
  }

  // ── exiting: walk off platform ──
  if (s.behavior === 'exiting') {
    s.x += s.direction * s.speed;
    if (s.x < -sprW - 20 || s.x > cw + 20) {
      s.behavior = 'offscreen';
      s.timer = 300 + input.random() * 600;
      s.visible = false;
      return { state: s, effects };
    }
  }

  // ── movement ──
  if (s.behavior === 'walking' || s.behavior === 'fleeing') {
    s.x += s.direction * s.speed;
    const l = platL(curPlat, cw);
    const r = platR(curPlat, cw, sprW);
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
    const ty = platY(tp, vh, sprH);
    s.jumpVy += config.gravity;
    s.y += s.jumpVy;
    const dxj = s.jumpTargetX - s.x;
    s.x += dxj * 0.05;
    s.direction = dxj > 0 ? 1 : -1;
    if (s.jumpVy > 0 && s.y >= ty) {
      s.y = ty;
      s.platform = s.jumpTargetPlat;
      s.behavior = 'idle';
      s.timer = 20 + input.random() * 40;
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
      effects.speech = `zzZ${dots}`;
      effects.speechDuration = 35;
      s.speechTimer = 35;
    }
  }

  // ── speech timer ──
  if (s.speechTimer > 0) {
    s.speechTimer--;
  }

  // ── powerup fx ──
  if (s.behavior === 'powerup') {
    effects.showPowerFx = true;
    if (!effects.powerFxPosition) {
      effects.powerFxPosition = { x: s.x, y: s.y };
    }
  }

  return { state: s, effects };
}

export function selectSprite(state: MascotState): {
  spriteKey: SpriteKey;
  flip: boolean;
} {
  const flip = state.direction === -1;
  const WALK_KEYS: SpriteKey[] = ['stand', 'walkR', 'stand', 'walkL'];

  switch (state.behavior) {
    case 'walking':
    case 'fleeing':
    case 'entering':
    case 'exiting':
      return { spriteKey: WALK_KEYS[Math.floor(state.tick / 6) % 4], flip };
    case 'waving':
      return {
        spriteKey: state.tick % 16 < 8 ? 'wave1' : 'wave2',
        flip,
      };
    case 'jumping':
      return { spriteKey: state.jumpVy < 0 ? 'walkR' : 'walkL', flip };
    case 'sleeping':
      return { spriteKey: 'sit', flip };
    case 'powerup':
      return {
        spriteKey: state.tick % 4 < 2 ? 'stand' : 'walkR',
        flip,
      };
    default:
      return { spriteKey: 'stand', flip };
  }
}
