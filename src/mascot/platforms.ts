import type { Platform } from './types';

/**
 * Returns page-aware platforms based on the current route and viewport height.
 * Ground platform (y:20, full width) and navbar platform (y: vh-68, full width)
 * are always included. Route-specific platforms are added per path.
 */
export function getPagePlatforms(path: string, vh: number): Platform[] {
  const base: Platform[] = [
    { y: 20, xMin: 0, xMax: 1 }, // ground (footer area)
    { y: vh - 68, xMin: 0, xMax: 1 }, // navbar
  ];

  switch (path) {
    case '/':
      // Hero: just ground + navbar, keep it minimal
      break;
    case '/about':
    case '/privacy':
      base.push({ y: vh * 0.4, xMin: 0.1, xMax: 0.6 });
      base.push({ y: vh * 0.6, xMin: 0.4, xMax: 0.9 });
      break;
    case '/resume':
      base.push({ y: vh * 0.35, xMin: 0.05, xMax: 0.5 });
      base.push({ y: vh * 0.55, xMin: 0.3, xMax: 0.8 });
      base.push({ y: vh * 0.75, xMin: 0.1, xMax: 0.6 });
      break;
    case '/projects':
      base.push({ y: vh * 0.45, xMin: 0.1, xMax: 0.55 });
      base.push({ y: vh * 0.45, xMin: 0.55, xMax: 0.95 });
      base.push({ y: vh * 0.7, xMin: 0.2, xMax: 0.8 });
      break;
    case '/anime':
      base.push({ y: vh * 0.35, xMin: 0.05, xMax: 0.4 });
      base.push({ y: vh * 0.35, xMin: 0.4, xMax: 0.7 });
      base.push({ y: vh * 0.35, xMin: 0.7, xMax: 0.98 });
      base.push({ y: vh * 0.6, xMin: 0.15, xMax: 0.85 });
      break;
    default:
      base.push({ y: vh * 0.4, xMin: 0.1, xMax: 0.9 });
  }

  return base;
}

/** Top Y coordinate (CSS top) for a platform given viewport height and sprite height. */
export function platformTopY(p: Platform, vh: number, spriteH: number): number {
  return vh - p.y - spriteH;
}

/** Left X coordinate (CSS left) for a platform given viewport width. */
export function platformLeftX(p: Platform, vw: number): number {
  return p.xMin * vw;
}

/** Right X coordinate (CSS left of right edge) for a platform given viewport width and sprite width. */
export function platformRightX(
  p: Platform,
  vw: number,
  spriteW: number,
): number {
  return p.xMax * vw - spriteW;
}
