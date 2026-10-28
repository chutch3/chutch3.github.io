import { test, expect } from '@playwright/test';

test('old hash-router links redirect to real paths', async ({ page }) => {
  await page.goto('/#/about');
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page).toHaveTitle('About | Cody Hutchens');
});

test('pages are served as prerendered HTML', async ({ request }) => {
  const res = await request.get('/about/');
  expect(res.ok()).toBe(true);
  expect(await res.text()).toContain('SmarterDx');
});
