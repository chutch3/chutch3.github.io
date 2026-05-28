import { describe, it, expect } from 'vitest';
import { createInitialState, tick, selectSprite } from '@/mascot/state-machine';
import type {
  MascotConfig,
  MascotState,
  TickInput,
  Platform,
} from '@/mascot/types';

const DEFAULT_CONFIG: MascotConfig = {
  spriteWidth: 48,
  spriteHeight: 66,
  walkSpeed: 1.2,
  fleeSpeed: 3,
  exitSpeed: 1.5,
  cursorFleeRadius: 110,
  gravity: 0.4,
  initialJumpVy: -9,
};

const BASE_PLATFORMS: Platform[] = [
  { y: 20, xMin: 0, xMax: 1 },
  { y: 732, xMin: 0, xMax: 1 },
];

function makeInput(overrides: Partial<TickInput> = {}): TickInput {
  return {
    mouseX: -9999,
    mouseY: -9999,
    clicked: false,
    viewportWidth: 1000,
    viewportHeight: 800,
    platforms: BASE_PLATFORMS,
    random: () => 0.5,
    ...overrides,
  };
}

function makeState(overrides: Partial<MascotState> = {}): MascotState {
  return {
    x: 200,
    y: 714,
    platform: 0,
    behavior: 'idle',
    direction: 1,
    tick: 0,
    timer: 50,
    speed: 1.2,
    jumpVy: 0,
    jumpTargetPlat: 0,
    jumpTargetX: 0,
    speechTimer: 0,
    sleepBubbleGrow: 0,
    visible: true,
    clickCount: 0,
    clickDecay: 0,
    ...overrides,
  };
}

describe('createInitialState', () => {
  it('returns offscreen behavior with correct timer', () => {
    const state = createInitialState(DEFAULT_CONFIG, 300);
    expect(state.behavior).toBe('offscreen');
    expect(state.timer).toBe(300);
    expect(state.visible).toBe(false);
    expect(state.tick).toBe(0);
    expect(state.speed).toBe(DEFAULT_CONFIG.walkSpeed);
  });
});

describe('tick - offscreen behavior', () => {
  it('decrements timer each tick', () => {
    const state = makeState({
      behavior: 'offscreen',
      timer: 10,
      visible: false,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.state.timer).toBe(9);
    expect(result.state.behavior).toBe('offscreen');
  });

  it('transitions to entering when timer hits 0', () => {
    // random() calls: platform index = floor(0.25 * 2) = 0, direction = 0.25 < 0.5 -> 1
    let callIdx = 0;
    const randoms = [0.25, 0.25];
    const state = makeState({
      behavior: 'offscreen',
      timer: 1,
      visible: false,
    });
    const input = makeInput({
      random: () => randoms[callIdx++] ?? 0.5,
    });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('entering');
    expect(result.state.visible).toBe(true);
    expect(result.state.platform).toBeDefined();
  });
});

describe('tick - entering behavior', () => {
  it('transitions to idle when x passes platform bounds (enters from left)', () => {
    // Character entering from left, direction=1, once inside platform bounds -> walking
    const state = makeState({
      behavior: 'entering',
      direction: 1,
      x: -5,
      y: 714,
      platform: 0,
      timer: 999,
      speed: 1.2,
    });
    // First tick: x = -5 + 1.2 = -3.8, still outside platL(0) = 0
    const r1 = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(r1.state.behavior).toBe('entering');

    // Move x to just before the left edge
    const state2 = makeState({
      behavior: 'entering',
      direction: 1,
      x: -0.5,
      y: 714,
      platform: 0,
      timer: 999,
      speed: 1.2,
    });
    // x = -0.5 + 1.2 = 0.7, now inside [0, 952] -> transition
    const r2 = tick(state2, makeInput(), DEFAULT_CONFIG);
    expect(r2.state.behavior).toBe('walking');
  });
});

describe('tick - walking behavior', () => {
  it('clamps to platform bounds and reverses direction at right edge', () => {
    const state = makeState({
      behavior: 'walking',
      direction: 1,
      x: 951,
      speed: 1.2,
      timer: 50,
      platform: 0,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    // platR = 1.0 * 1000 - 48 = 952, x = 951 + 1.2 = 952.2, clamped to 952
    expect(result.state.x).toBe(952);
    expect(result.state.direction).toBe(-1);
  });

  it('clamps to platform bounds and reverses direction at left edge', () => {
    const state = makeState({
      behavior: 'walking',
      direction: -1,
      x: 0.5,
      speed: 1.2,
      timer: 50,
      platform: 0,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    // platL = 0, x = 0.5 - 1.2 = -0.7, clamped to 0
    expect(result.state.x).toBe(0);
    expect(result.state.direction).toBe(1);
  });
});

describe('tick - click handling', () => {
  it('sets behavior to fleeing with speech effect on click', () => {
    const state = makeState({
      behavior: 'idle',
      timer: 50,
      visible: true,
    });
    const input = makeInput({ clicked: true, random: () => 0.5 });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('fleeing');
    expect(result.state.speed).toBe(DEFAULT_CONFIG.fleeSpeed);
    expect(result.state.clickCount).toBe(1);
    expect(result.state.clickDecay).toBe(40);
    expect(result.effects.speech).not.toBeNull();
  });

  it('does not respond to click when offscreen', () => {
    const state = makeState({
      behavior: 'offscreen',
      timer: 50,
      visible: false,
    });
    const input = makeInput({ clicked: true });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('offscreen');
  });
});

describe('tick - cursor flee', () => {
  it('triggers fleeing in opposite direction when cursor is within radius', () => {
    const state = makeState({
      behavior: 'idle',
      x: 200,
      y: 714,
      timer: 50,
      visible: true,
    });
    // Center of sprite: x + sprW/2 = 224, y + sprH/2 = 747
    // Place mouse at 250, 747 -> dx=26, dy=0, dist=26 < 110
    const input = makeInput({ mouseX: 250, mouseY: 747 });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('fleeing');
    // Mouse is to the right (dx > 0), so flee left (direction = -1)
    expect(result.state.direction).toBe(-1);
  });

  it('does not trigger flee when cursor is far away', () => {
    const state = makeState({
      behavior: 'idle',
      x: 200,
      y: 714,
      timer: 50,
    });
    const input = makeInput({ mouseX: 500, mouseY: 500 });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('idle');
  });

  it('does not trigger flee during jumping', () => {
    const state = makeState({
      behavior: 'jumping',
      x: 200,
      y: 714,
      jumpVy: -5,
      jumpTargetPlat: 1,
      jumpTargetX: 500,
      visible: true,
    });
    const input = makeInput({ mouseX: 224, mouseY: 747 });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('jumping');
  });
});

describe('tick - behavior timer rolls', () => {
  // All tests use a state where timer will reach 0 (timer=1)
  function timerExpiredState(): MascotState {
    return makeState({ behavior: 'idle', timer: 1 });
  }

  it('roll < 0.18: exiting', () => {
    let callIdx = 0;
    // roll=0.1, exitDirection=0.3 -> direction = 0.3 < 0.5 -> -1
    const randoms = [0.1, 0.3];
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(timerExpiredState(), input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('exiting');
    expect(result.state.speed).toBe(DEFAULT_CONFIG.exitSpeed);
  });

  it('roll 0.18-0.38: idle (with potential speech)', () => {
    let callIdx = 0;
    // roll=0.3, timer=60+random*100, speechChance=0.2 (< 0.35 -> speech), speechIdx pick
    const randoms = [0.3, 0.5, 0.2, 0.5];
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(timerExpiredState(), input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('idle');
    expect(result.effects.speech).not.toBeNull();
  });

  it('roll 0.18-0.38: idle without speech when speechChance >= 0.35', () => {
    let callIdx = 0;
    // roll=0.3, speechChance=0.5 (>= 0.35 -> no speech), timer pick
    const randoms = [0.3, 0.5, 0.5];
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(timerExpiredState(), input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('idle');
    expect(result.effects.speech).toBeNull();
  });

  it('roll 0.38-0.62: walking', () => {
    let callIdx = 0;
    // roll=0.5, direction=0.3 -> -1, timer pick
    const randoms = [0.5, 0.3, 0.5];
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(timerExpiredState(), input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('walking');
    expect(result.state.direction).toBe(-1);
  });

  it('roll 0.62-0.72: waving with speech "hey! ✧"', () => {
    let callIdx = 0;
    const randoms = [0.67];
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(timerExpiredState(), input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('waving');
    expect(result.effects.speech).toBe('hey! ✧');
  });

  it('roll 0.72-0.80: sleeping', () => {
    let callIdx = 0;
    // roll=0.75, timer pick
    const randoms = [0.75, 0.5];
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(timerExpiredState(), input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('sleeping');
    // sleepBubbleGrow starts at 0 then increments in the same tick
    expect(result.state.sleepBubbleGrow).toBe(1);
  });

  it('roll 0.80-0.87: powerup with speech and fx', () => {
    let callIdx = 0;
    const randoms = [0.83];
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(timerExpiredState(), input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('powerup');
    expect(result.effects.speech).toBe('HAAA!!');
    expect(result.effects.showPowerFx).toBe(true);
    expect(result.effects.powerFxPosition).not.toBeNull();
  });

  it('roll >= 0.87: jumping (with multiple platforms)', () => {
    let callIdx = 0;
    // roll=0.9, targetPlatIdx=0.5 (floor(0.5*1)=0, others=[1] -> target=1), landingX pick
    const randoms = [0.9, 0.5, 0.5];
    const state = makeState({ behavior: 'idle', timer: 1, platform: 0 });
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('jumping');
    expect(result.state.jumpTargetPlat).toBe(1);
    // Jump physics run in the same tick: jumpVy = initialJumpVy + gravity
    expect(result.state.jumpVy).toBeCloseTo(
      DEFAULT_CONFIG.initialJumpVy + DEFAULT_CONFIG.gravity,
    );
  });

  it('roll >= 0.87 falls back to walking with only 1 platform', () => {
    let callIdx = 0;
    // roll=0.9, directionRandom=0.3 -> -1
    const randoms = [0.9, 0.3];
    const state = makeState({ behavior: 'idle', timer: 1, platform: 0 });
    const input = makeInput({
      random: () => randoms[callIdx++] ?? 0.5,
      platforms: [{ y: 20, xMin: 0, xMax: 1 }],
    });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('walking');
  });
});

describe('tick - exiting behavior', () => {
  it('transitions to offscreen when x is out of viewport (left)', () => {
    let callIdx = 0;
    const randoms = [0.5];
    // spriteWidth=48, threshold is -sprW-20 = -68, so x must be < -68
    const state = makeState({
      behavior: 'exiting',
      direction: -1,
      x: -70,
      speed: 1.5,
      timer: 999,
    });
    const input = makeInput({ random: () => randoms[callIdx++] ?? 0.5 });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('offscreen');
    expect(result.state.visible).toBe(false);
  });

  it('transitions to offscreen when x is out of viewport (right)', () => {
    let callIdx = 0;
    const randoms = [0.5];
    const state = makeState({
      behavior: 'exiting',
      direction: 1,
      x: 1025,
      speed: 1.5,
      timer: 999,
    });
    const input = makeInput({
      viewportWidth: 1000,
      random: () => randoms[callIdx++] ?? 0.5,
    });
    const result = tick(state, input, DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('offscreen');
    expect(result.state.visible).toBe(false);
  });

  it('continues exiting when still on screen', () => {
    const state = makeState({
      behavior: 'exiting',
      direction: 1,
      x: 500,
      speed: 1.5,
      timer: 999,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.state.behavior).toBe('exiting');
    expect(result.state.x).toBe(501.5);
  });
});

describe('tick - jump physics', () => {
  it('applies gravity to jumpVy each tick', () => {
    const state = makeState({
      behavior: 'jumping',
      jumpVy: -5,
      jumpTargetPlat: 1,
      jumpTargetX: 500,
      y: 400,
      x: 200,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    // jumpVy = -5 + 0.4 = -4.6
    expect(result.state.jumpVy).toBeCloseTo(-4.6);
    // y = 400 + (-4.6) = 395.4
    expect(result.state.y).toBeCloseTo(395.4);
  });

  it('transitions to idle on landing', () => {
    // Target platform is BASE_PLATFORMS[1] (y=732), platY = 800 - 732 - 66 = 2
    const state = makeState({
      behavior: 'jumping',
      jumpVy: 5,
      jumpTargetPlat: 0,
      jumpTargetX: 500,
      y: 713, // platY for ground = 800 - 20 - 66 = 714
      x: 490,
      platform: 1,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    // jumpVy = 5 + 0.4 = 5.4, y = 713 + 5.4 = 718.4 > 714 (platY of platform 0)
    // -> lands!
    expect(result.state.behavior).toBe('idle');
    expect(result.state.y).toBe(714);
    expect(result.state.platform).toBe(0);
    expect(result.state.jumpVy).toBe(0);
  });

  it('does not land when jumpVy is negative (still rising)', () => {
    const state = makeState({
      behavior: 'jumping',
      jumpVy: -3,
      jumpTargetPlat: 0,
      jumpTargetX: 500,
      y: 710,
      x: 490,
      platform: 1,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    // jumpVy = -3 + 0.4 = -2.6, still negative -> no landing check
    expect(result.state.behavior).toBe('jumping');
  });

  it('x lerps toward jump target', () => {
    const state = makeState({
      behavior: 'jumping',
      jumpVy: -5,
      jumpTargetPlat: 1,
      jumpTargetX: 500,
      y: 400,
      x: 200,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    // dx = 500 - 200 = 300, x += 300 * 0.05 = 15, x = 215
    expect(result.state.x).toBeCloseTo(215);
    expect(result.state.direction).toBe(1);
  });
});

describe('tick - sleeping behavior', () => {
  it('produces speech every 40 ticks', () => {
    // sleepBubbleGrow increments: 0 -> 1. When % 40 === 1, produces speech
    const state = makeState({
      behavior: 'sleeping',
      timer: 100,
      sleepBubbleGrow: 0,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.state.sleepBubbleGrow).toBe(1);
    // 1 % 40 === 1 -> speech
    expect(result.effects.speech).toContain('zzZ');
  });

  it('does not produce speech on other ticks', () => {
    const state = makeState({
      behavior: 'sleeping',
      timer: 100,
      sleepBubbleGrow: 10,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.state.sleepBubbleGrow).toBe(11);
    // 11 % 40 !== 1 -> no speech from sleeping
    expect(result.effects.speech).toBeNull();
  });
});

describe('tick - speech timer', () => {
  it('counts down and clears speech when done', () => {
    const state = makeState({
      behavior: 'idle',
      timer: 50,
      speechTimer: 1,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.state.speechTimer).toBe(0);
  });

  it('continues counting down while positive', () => {
    const state = makeState({
      behavior: 'idle',
      timer: 50,
      speechTimer: 10,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.state.speechTimer).toBe(9);
  });
});

describe('tick - powerup effects', () => {
  it('produces showPowerFx effect', () => {
    const state = makeState({
      behavior: 'powerup',
      timer: 50,
      speechTimer: 50,
      x: 200,
      y: 714,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.effects.showPowerFx).toBe(true);
  });
});

describe('tick - click decay', () => {
  it('decrements clickDecay each tick', () => {
    const state = makeState({
      behavior: 'idle',
      timer: 50,
      clickCount: 3,
      clickDecay: 10,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.state.clickDecay).toBe(9);
    expect(result.state.clickCount).toBe(3);
  });

  it('resets clickCount when clickDecay reaches 0', () => {
    const state = makeState({
      behavior: 'idle',
      timer: 50,
      clickCount: 3,
      clickDecay: 1,
    });
    const result = tick(state, makeInput(), DEFAULT_CONFIG);
    expect(result.state.clickDecay).toBe(0);
    expect(result.state.clickCount).toBe(0);
  });
});

describe('tick - purity', () => {
  it('does not mutate the input state', () => {
    const state = makeState({ behavior: 'walking', timer: 50, x: 200 });
    const originalX = state.x;
    const originalTimer = state.timer;
    tick(state, makeInput(), DEFAULT_CONFIG);
    expect(state.x).toBe(originalX);
    expect(state.timer).toBe(originalTimer);
  });
});

describe('selectSprite', () => {
  it('returns stand for idle', () => {
    const state = makeState({ behavior: 'idle', tick: 0, direction: 1 });
    const result = selectSprite(state);
    expect(result.spriteKey).toBe('stand');
    expect(result.flip).toBe(false);
  });

  it('flips when direction is -1', () => {
    const state = makeState({ behavior: 'idle', direction: -1 });
    const result = selectSprite(state);
    expect(result.flip).toBe(true);
  });

  it('cycles walk frames for walking', () => {
    // tick/6 % 4: 0=stand, 1=walkR, 2=stand, 3=walkL
    expect(
      selectSprite(makeState({ behavior: 'walking', tick: 0 })).spriteKey,
    ).toBe('stand');
    expect(
      selectSprite(makeState({ behavior: 'walking', tick: 6 })).spriteKey,
    ).toBe('walkR');
    expect(
      selectSprite(makeState({ behavior: 'walking', tick: 12 })).spriteKey,
    ).toBe('stand');
    expect(
      selectSprite(makeState({ behavior: 'walking', tick: 18 })).spriteKey,
    ).toBe('walkL');
  });

  it('cycles walk frames for fleeing', () => {
    expect(
      selectSprite(makeState({ behavior: 'fleeing', tick: 6 })).spriteKey,
    ).toBe('walkR');
  });

  it('cycles walk frames for entering', () => {
    expect(
      selectSprite(makeState({ behavior: 'entering', tick: 12 })).spriteKey,
    ).toBe('stand');
  });

  it('cycles walk frames for exiting', () => {
    expect(
      selectSprite(makeState({ behavior: 'exiting', tick: 18 })).spriteKey,
    ).toBe('walkL');
  });

  it('returns wave1/wave2 alternating for waving', () => {
    expect(
      selectSprite(makeState({ behavior: 'waving', tick: 0 })).spriteKey,
    ).toBe('wave1');
    expect(
      selectSprite(makeState({ behavior: 'waving', tick: 8 })).spriteKey,
    ).toBe('wave2');
    expect(
      selectSprite(makeState({ behavior: 'waving', tick: 16 })).spriteKey,
    ).toBe('wave1');
  });

  it('returns walkR when ascending during jump, walkL when descending', () => {
    expect(
      selectSprite(makeState({ behavior: 'jumping', jumpVy: -5 })).spriteKey,
    ).toBe('walkR');
    expect(
      selectSprite(makeState({ behavior: 'jumping', jumpVy: 3 })).spriteKey,
    ).toBe('walkL');
  });

  it('returns sit for sleeping', () => {
    expect(selectSprite(makeState({ behavior: 'sleeping' })).spriteKey).toBe(
      'sit',
    );
  });

  it('alternates stand/walkR for powerup', () => {
    expect(
      selectSprite(makeState({ behavior: 'powerup', tick: 0 })).spriteKey,
    ).toBe('stand');
    expect(
      selectSprite(makeState({ behavior: 'powerup', tick: 2 })).spriteKey,
    ).toBe('walkR');
    expect(
      selectSprite(makeState({ behavior: 'powerup', tick: 4 })).spriteKey,
    ).toBe('stand');
  });
});
