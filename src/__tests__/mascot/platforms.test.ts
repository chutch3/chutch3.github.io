import { describe, it, expect } from 'vitest';
import {
  getPagePlatforms,
  platformTopY,
  platformLeftX,
  platformRightX,
} from '@/mascot/platforms';
import type { Platform } from '@/mascot/types';

describe('getPagePlatforms', () => {
  const vh = 800;

  it('always includes ground platform (y:20, full width) for every route', () => {
    const routes = [
      '/',
      '/about',
      '/resume',
      '/projects',
      '/anime',
      '/privacy',
      '/unknown',
    ];
    for (const route of routes) {
      const platforms = getPagePlatforms(route, vh);
      const ground = platforms.find(
        (p) => p.y === 20 && p.xMin === 0 && p.xMax === 1,
      );
      expect(
        ground,
        `ground platform missing for route "${route}"`,
      ).toBeDefined();
    }
  });

  it('always includes navbar platform (y: vh-68) for every route', () => {
    const routes = [
      '/',
      '/about',
      '/resume',
      '/projects',
      '/anime',
      '/privacy',
      '/unknown',
    ];
    for (const route of routes) {
      const platforms = getPagePlatforms(route, vh);
      const navbar = platforms.find(
        (p) => p.y === vh - 68 && p.xMin === 0 && p.xMax === 1,
      );
      expect(
        navbar,
        `navbar platform missing for route "${route}"`,
      ).toBeDefined();
    }
  });

  it('route "/" has exactly 2 platforms (ground + navbar)', () => {
    const platforms = getPagePlatforms('/', vh);
    expect(platforms).toHaveLength(2);
  });

  it('route "/resume" has exactly 5 platforms', () => {
    const platforms = getPagePlatforms('/resume', vh);
    expect(platforms).toHaveLength(5);
  });

  it('route "/anime" has exactly 6 platforms', () => {
    const platforms = getPagePlatforms('/anime', vh);
    expect(platforms).toHaveLength(6);
  });

  it('unknown route gets a default mid-height platform (3 total)', () => {
    const platforms = getPagePlatforms('/nonexistent', vh);
    expect(platforms).toHaveLength(3);
    // The third platform should be at a mid-height position
    const extra = platforms[2];
    expect(extra.y).toBe(vh * 0.4);
    expect(extra.xMin).toBe(0.1);
    expect(extra.xMax).toBe(0.9);
  });

  it('all platforms have xMin < xMax and y > 0', () => {
    const routes = [
      '/',
      '/about',
      '/resume',
      '/projects',
      '/anime',
      '/privacy',
      '/unknown',
    ];
    for (const route of routes) {
      const platforms = getPagePlatforms(route, vh);
      for (const p of platforms) {
        expect(
          p.xMin,
          `xMin >= xMax for platform on route "${route}"`,
        ).toBeLessThan(p.xMax);
        expect(p.y, `y <= 0 for platform on route "${route}"`).toBeGreaterThan(
          0,
        );
      }
    }
  });

  it('route "/about" has exactly 4 platforms', () => {
    const platforms = getPagePlatforms('/about', vh);
    expect(platforms).toHaveLength(4);
  });

  it('route "/privacy" has exactly 4 platforms (same as /about)', () => {
    const platforms = getPagePlatforms('/privacy', vh);
    expect(platforms).toHaveLength(4);
  });

  it('route "/projects" has exactly 5 platforms', () => {
    const platforms = getPagePlatforms('/projects', vh);
    expect(platforms).toHaveLength(5);
  });
});

describe('platformTopY', () => {
  it('returns correct top Y position for a platform', () => {
    const p: Platform = { y: 20, xMin: 0, xMax: 1 };
    const vh = 800;
    const sprH = 66;
    // vh - p.y - sprH = 800 - 20 - 66 = 714
    expect(platformTopY(p, vh, sprH)).toBe(714);
  });

  it('works with navbar platform', () => {
    const vh = 800;
    const p: Platform = { y: vh - 68, xMin: 0, xMax: 1 };
    const sprH = 66;
    // vh - (vh - 68) - sprH = 68 - 66 = 2
    expect(platformTopY(p, vh, sprH)).toBe(2);
  });
});

describe('platformLeftX', () => {
  it('returns correct left X position', () => {
    const p: Platform = { y: 100, xMin: 0.1, xMax: 0.9 };
    const vw = 1000;
    // 0.1 * 1000 = 100
    expect(platformLeftX(p, vw)).toBe(100);
  });

  it('returns 0 for full-width platform', () => {
    const p: Platform = { y: 100, xMin: 0, xMax: 1 };
    expect(platformLeftX(p, 1000)).toBe(0);
  });
});

describe('platformRightX', () => {
  it('returns correct right X position', () => {
    const p: Platform = { y: 100, xMin: 0.1, xMax: 0.9 };
    const vw = 1000;
    const sprW = 48;
    // 0.9 * 1000 - 48 = 852
    expect(platformRightX(p, vw, sprW)).toBe(852);
  });

  it('returns vw - sprW for full-width platform', () => {
    const p: Platform = { y: 100, xMin: 0, xMax: 1 };
    const vw = 1000;
    const sprW = 48;
    expect(platformRightX(p, vw, sprW)).toBe(952);
  });
});
