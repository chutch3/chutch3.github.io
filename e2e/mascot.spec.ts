import { test, expect } from '@playwright/test';

async function waitForCharacterOnScreen(
  page: import('@playwright/test').Page,
  maxWaitMs = 40000,
) {
  const canvas = page.locator('canvas');
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await page.waitForTimeout(250);
    const box = await canvas.boundingBox();
    if (box && box.x > 10 && box.x < 1200 && box.y > 10) {
      return box;
    }
  }
  return null;
}

test.describe('PixelMascot', () => {
  test('character appears on screen', async ({ page }) => {
    await page.goto('/#/');
    const box = await waitForCharacterOnScreen(page);
    expect(box).not.toBeNull();
  });

  test('character responds to click with speech', async ({ page }) => {
    await page.goto('/#/');
    const canvas = page.locator('canvas');
    const clickPhrases = ['NANI?!', 'oi!', 'やめて!', '(╯°□°)╯', 'hey!!', '!?'];

    let found = false;
    for (let attempt = 0; attempt < 5 && !found; attempt++) {
      const box = await waitForCharacterOnScreen(page);
      if (!box) continue;

      await page.waitForTimeout(300);
      const freshBox = await canvas.boundingBox();
      if (!freshBox || freshBox.x < 20 || freshBox.x > 1200) continue;

      await page.mouse.click(
        freshBox.x + freshBox.width / 2,
        freshBox.y + freshBox.height / 2,
      );
      await page.waitForTimeout(500);

      found = await page.evaluate((phrases) => {
        const els = document.querySelectorAll('*');
        for (const el of els) {
          const t = el.textContent || '';
          if (phrases.some((p: string) => t === p)) return true;
        }
        return false;
      }, clickPhrases);
    }

    expect(found).toBe(true);
  });

  test('character appears after route change', async ({ page }) => {
    await page.goto('/#/about');
    const box = await waitForCharacterOnScreen(page);
    expect(box).not.toBeNull();
  });
});
