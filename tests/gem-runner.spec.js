import { expect, test } from '@playwright/test';

test('TC-17: Gem Runner 3D starts a Three.js run and changes lanes', async ({ page }, testInfo) => {
  await page.goto('/');
  const card = page.locator('.game-card').filter({ hasText: 'Gem Runner 3D' });
  await card.getByRole('button', { name: /Play now/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Gem Runner 3D' });
  await expect(dialog.locator('.gem-runner-stage canvas')).toBeVisible();
  await dialog.getByRole('button', { name: 'Start running' }).click();
  await expect(dialog.getByText('LANE 2 / 3')).toBeVisible();
  await dialog.getByRole('button', { name: 'Move left' }).click();
  await expect(dialog.getByText('LANE 1 / 3')).toBeVisible();
  const screenshot = 'evidence/screenshots/tc-17-gem-runner-3d.png';
  await page.screenshot({ path: screenshot, fullPage: false });
  await testInfo.attach('tc-17-gem-runner-3d.png', { path: screenshot, contentType: 'image/png' });
  await dialog.getByRole('button', { name: 'Close game' }).click();
});
