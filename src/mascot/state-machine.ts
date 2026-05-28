import type {
  MascotConfig,
  MascotState,
  TickInput,
  TickEffects,
  TickResult,
  SpriteKey,
  Platform,
  DustParticle,
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

const ROUTE_SPEECH: Record<string, string[]> = {
  '/anime': ['popcorn time', '🍿 sugoi', 'tier 1 waifu'],
  '/resume': ['impressive', '10/10', 'hired'],
  '/privacy': ["they're watching...", 'shhh', '*paranoid*'],
  '/projects': ['neat!', '*points*', 'cool stuff'],
};

function getRouteSpeech(
  route: string,
  random: () => number,
): { speech: string } | null {
  const lines = ROUTE_SPEECH[route];
  if (!lines) return null;
  if (random() < 0.6) {
    return { speech: lines[Math.floor(random() * lines.length)] };
  }
  return null;
}

const TUMBLE_SCROLL_THRESHOLD = 30;
const TUMBLE_SPIN = 0.25;
const TUMBLE_DURATION = 30;
const BORED_THRESHOLD = 600;
const BORED_TO_SLEEP_TIMER = 200;
const CLICKS_TO_POWERUP = 5;

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
    rotation: 0,
    tumbleSpin: 0,
    justLanded: false,
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
    landingDust: null,
    powerUpParticles: null,
  };

  // ── click decay ──
  if (s.clickDecay > 0) {
    s.clickDecay--;
    if (s.clickDecay <= 0) s.clickCount = 0;
  }

  // ── idle awareness: mouseMove startle edge ──
  if (
    input.mouseMoved &&
    s.visible &&
    (s.behavior === 'bored' || s.behavior === 'sleeping')
  ) {
    s.behavior = 'startled';
    s.timer = 25;
    effects.speech = '!?';
    effects.speechDuration = 30;
    s.speechTimer = 30;
    s.jumpVy = -4;
  }

  // ── idle awareness: long idle triggers bored ──
  if (
    input.userIdleTicks >= BORED_THRESHOLD &&
    s.behavior === 'idle' &&
    s.visible
  ) {
    s.behavior = 'bored';
    s.timer = 600;
    effects.speech = 'yawn~';
    effects.speechDuration = 40;
    s.speechTimer = 40;
  }

  // ── handle click/tap ──
  if (input.clicked && s.visible && s.behavior !== 'offscreen') {
    s.clickCount++;
    s.clickDecay = 40;
    if (s.clickCount >= CLICKS_TO_POWERUP) {
      // Rapid clicks within decay window force a powerup transformation.
      // Works the same on mouse and touch so desktop users can trigger it
      // deliberately — without this, continuous cursor flee on desktop
      // prevents the random powerup roll from ever firing.
      s.clickCount = 0;
      s.behavior = 'powerup';
      s.timer = 70;
      effects.speech = 'HAAAA!!';
      effects.speechDuration = 60;
      s.speechTimer = 60;
      effects.showPowerFx = true;
      effects.powerFxPosition = { x: s.x, y: s.y };
    } else {
      const speechIdx = Math.floor(input.random() * CLICK_SPEECH.length);
      effects.speech = CLICK_SPEECH[speechIdx];
      effects.speechDuration = 28;
      s.speechTimer = 28;
      s.behavior = 'fleeing';
      s.direction = input.random() < 0.5 ? -1 : 1;
      s.timer = 25;
      s.speed = config.fleeSpeed;
    }
  }

  // ── cursor flee ──
  if (
    s.visible &&
    s.behavior !== 'jumping' &&
    s.behavior !== 'offscreen' &&
    s.behavior !== 'exiting' &&
    s.behavior !== 'entering' &&
    s.behavior !== 'tumbling' &&
    s.behavior !== 'bored' &&
    s.behavior !== 'startled'
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

  // ── scroll tumble ──
  if (
    s.visible &&
    s.behavior !== 'tumbling' &&
    s.behavior !== 'offscreen' &&
    s.behavior !== 'entering' &&
    s.behavior !== 'exiting' &&
    s.behavior !== 'jumping' &&
    Math.abs(input.scrollVelocity) > TUMBLE_SCROLL_THRESHOLD
  ) {
    s.behavior = 'tumbling';
    s.timer = TUMBLE_DURATION;
    s.tumbleSpin = input.scrollVelocity > 0 ? TUMBLE_SPIN : -TUMBLE_SPIN;
    s.direction = input.scrollVelocity > 0 ? 1 : -1;
    s.speed = config.walkSpeed * 1.5;
  }

  // ── behavior timer ──
  if (
    s.behavior !== 'jumping' &&
    s.behavior !== 'offscreen' &&
    s.behavior !== 'entering' &&
    s.behavior !== 'exiting' &&
    s.behavior !== 'tumbling' &&
    s.behavior !== 'bored' &&
    s.behavior !== 'startled'
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
        const routeReact = getRouteSpeech(input.route, input.random);
        if (routeReact) {
          effects.speech = routeReact.speech;
          effects.speechDuration = 60;
          s.speechTimer = 60;
        } else if (input.random() < 0.35) {
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

  // ── tumble physics ──
  if (s.behavior === 'tumbling') {
    s.rotation += s.tumbleSpin;
    s.x += s.direction * s.speed;
    const l = platL(curPlat, cw);
    const r = platR(curPlat, cw, sprW);
    if (s.x < l) {
      s.x = l;
      s.direction = 1;
    }
    if (s.x > r) {
      s.x = r;
      s.direction = -1;
    }
    s.timer--;
    if (s.timer <= 0) {
      s.behavior = 'idle';
      s.timer = 30;
      s.rotation = 0;
      s.tumbleSpin = 0;
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
      s.justLanded = true;
    }
  }

  // ── bored progression ──
  if (s.behavior === 'bored') {
    s.timer--;
    if (s.timer <= BORED_TO_SLEEP_TIMER) {
      s.behavior = 'sleeping';
      s.sleepBubbleGrow = 0;
      s.timer = 200;
    }
  }

  // ── startled hop ──
  if (s.behavior === 'startled') {
    s.y += s.jumpVy;
    s.jumpVy += config.gravity;
    s.timer--;
    const ty = platY(curPlat, vh, sprH);
    if (s.jumpVy > 0 && s.y >= ty) {
      s.y = ty;
      s.jumpVy = 0;
    }
    if (s.timer <= 0) {
      s.behavior = 'idle';
      s.timer = 40;
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

  // ── privacy paranoia: swivel head during speech ──
  if (
    input.route === '/privacy' &&
    s.behavior === 'idle' &&
    s.speechTimer > 0
  ) {
    s.direction = s.tick % 8 < 4 ? 1 : -1;
  }

  // ── powerup fx ──
  if (s.behavior === 'powerup') {
    effects.showPowerFx = true;
    if (!effects.powerFxPosition) {
      effects.powerFxPosition = { x: s.x, y: s.y };
    }
    // Emit rising energy particles each tick during powerup.
    const particles: DustParticle[] = [];
    for (let p = 0; p < 3; p++) {
      const spread = (input.random() - 0.5) * config.spriteWidth;
      const vx = (input.random() - 0.5) * 0.4;
      const vy = -(1.5 + input.random() * 1.5);
      particles.push({ dx: spread, dy: 0, vx, vy, life: 18 });
    }
    effects.powerUpParticles = {
      x: s.x + config.spriteWidth / 2,
      y: s.y + config.spriteHeight,
      particles,
    };
  }

  // ── landing dust emission ──
  if (s.justLanded) {
    const particles: DustParticle[] = [];
    for (let p = 0; p < 5; p++) {
      const angle = input.random() * Math.PI;
      const speed = 0.6 + input.random() * 0.8;
      particles.push({
        dx: 0,
        dy: 0,
        vx: Math.cos(angle) * speed * (input.random() < 0.5 ? -1 : 1),
        vy: -Math.abs(Math.sin(angle)) * speed,
        life: 20,
      });
    }
    effects.landingDust = {
      x: s.x + config.spriteWidth / 2,
      y: s.y + config.spriteHeight,
      particles,
    };
    s.justLanded = false;
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
      return { spriteKey: 'saiyan', flip };
    case 'tumbling':
      return { spriteKey: state.tick % 6 < 3 ? 'walkR' : 'walkL', flip };
    case 'bored':
      if (state.timer > 480) {
        return { spriteKey: state.tick % 16 < 8 ? 'stand' : 'walkR', flip };
      }
      if (state.timer > 360) return { spriteKey: 'stand', flip };
      return { spriteKey: 'sit', flip };
    case 'startled':
      return { spriteKey: 'wave1', flip };
    default:
      return { spriteKey: 'stand', flip };
  }
}
