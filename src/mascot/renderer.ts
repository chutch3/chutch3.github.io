import type { SpriteFrame } from './types';

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  frame: SpriteFrame,
  palette: Record<number, string>,
  scale: number,
  spriteWidth: number,
  spriteHeight: number,
): void {
  ctx.clearRect(0, 0, spriteWidth * scale, spriteHeight * scale);
  for (let row = 0; row < spriteHeight; row++) {
    for (let col = 0; col < spriteWidth; col++) {
      const pixel = frame[row][col];
      if (!palette[pixel]) continue;
      ctx.fillStyle = palette[pixel];
      ctx.fillRect(col * scale, row * scale, scale, scale);
    }
  }
}
