import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const evidenceDir = 'evidence/screenshots';

test.beforeAll(async () => {
  await mkdir(evidenceDir, { recursive: true });
});

async function captureEvidence(page, testInfo, filename, fullPage = true) {
  const path = `${evidenceDir}/${filename}`;
  await page.screenshot({ path, fullPage });
  await testInfo.attach(filename, { path, contentType: 'image/png' });
}

test('TC-01/02: kids collection has eight educational and arcade picks across categories', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Pixel Pals Arcade/);
  await expect(page.getByRole('heading', { name: 'Games for curious kids' })).toBeVisible();
  await expect(page.locator('.game-card')).toHaveCount(8);
  await expect(page.getByText('Math', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Words', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Science', { exact: true }).first()).toBeVisible();
  await captureEvidence(page, testInfo, '01-kids-desktop.png');
});

test('TC-03: grown-up collection opens directly and contains five general-audience games', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /For grown-ups/ }).click();
  await expect(page.getByRole('heading', { name: 'Games for grown-ups' })).toBeVisible();
  await expect(page.locator('.game-card')).toHaveCount(5);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText('All ages').first()).toBeVisible();
  await captureEvidence(page, testInfo, '02-grown-up-desktop.png');
});

test('TC-14: every catalog game opens its playable activity', async ({ page }, testInfo) => {
  await page.goto('/');
  const collections = [
    { audience: 'kids', titles: ['Math Meteor', 'Word Wild', 'Dino Lab', 'Planet Pals', 'Code Camp', 'Star Catcher', 'Turbo Track', 'Gem Runner 3D'] },
    { audience: 'adult', titles: ['Neon Drift', 'Mythic Realms', 'Outpost Zero', 'Shadow Circuit', 'Summit Bound'] },
  ];

  for (const collection of collections) {
    if (collection.audience === 'adult') await page.getByRole('button', { name: /For grown-ups/ }).click();
    for (const title of collection.titles) {
      const card = page.locator('.game-card').filter({ hasText: title });
      await card.getByRole('button', { name: /Play now/ }).click();
      const dialog = page.getByRole('dialog', { name: title });
      await expect(dialog.locator('.challenge-panel')).toBeVisible();
      const slug = title.toLowerCase().replaceAll(' ', '-');
      await captureEvidence(page, testInfo, `tc-14-${collection.audience}-${slug}.png`, false);
      await dialog.getByRole('button', { name: 'Close game' }).click();
    }
  }
});

test('TC-15: Star Catcher starts a keyboard-and-touch controlled arcade round', async ({ page }, testInfo) => {
  await page.goto('/');
  const card = page.locator('.game-card').filter({ hasText: 'Star Catcher' });
  await card.getByRole('button', { name: /Play now/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Star Catcher' });
  await dialog.getByRole('button', { name: 'Start game' }).click();
  await expect(dialog.getByText('30s')).toBeVisible();
  await expect(dialog.locator('canvas')).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-15-star-catcher-gameplay.png', false);
  await page.keyboard.press('ArrowLeft');
  await dialog.getByRole('button', { name: 'Move right' }).click();
  await dialog.getByRole('button', { name: 'Close game' }).click();
});

test('TC-16: Turbo Track starts a Phaser race and responds to acceleration', async ({ page }, testInfo) => {
  await page.goto('/');
  const card = page.locator('.game-card').filter({ hasText: 'Turbo Track' });
  await card.getByRole('button', { name: /Play now/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Turbo Track' });
  await dialog.getByRole('button', { name: /Start race/ }).click();
  await expect(dialog.getByText('LAP 0 / 3')).toBeVisible();
  await expect(dialog.locator('.turbo-hud')).toContainText('🧭 0°');
  await dialog.getByRole('button', { name: 'Steer right' }).click();
  await expect(dialog.locator('.turbo-hud')).toContainText(/🧭 2\d°/);
  await dialog.getByRole('button', { name: 'Steer left' }).click();
  await expect(dialog.locator('.turbo-hud')).toContainText('🧭 0°');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(450);
  await page.keyboard.up('ArrowUp');
  await expect(dialog.locator('.turbo-hud')).toContainText(/⚡ [1-9]\d* km\/h/);
  const speedBeforeBrake = Number((await dialog.locator('.turbo-hud').innerText()).match(/⚡\s*(\d+) km\/h/)?.[1] ?? 0);
  await dialog.getByRole('button', { name: 'Brake' }).click();
  await expect.poll(async () => Number((await dialog.locator('.turbo-hud').innerText()).match(/⚡\s*(\d+) km\/h/)?.[1] ?? 0)).toBeLessThan(speedBeforeBrake);
  await dialog.getByRole('button', { name: 'Accelerate' }).click();
  await expect(dialog.locator('.turbo-hud')).toContainText(/⚡ [1-9]\d* km\/h/);
  await captureEvidence(page, testInfo, 'tc-16-turbo-track-racing.png', false);
  await dialog.getByRole('button', { name: 'Close game' }).click();
});

test('TC-04/06: search finds matches and handles empty results', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search games' }).fill('math');
  await expect(page.locator('.game-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Math Meteor' })).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-04-search-match.png');
  await page.getByRole('searchbox', { name: 'Search games' }).fill('not-a-game');
  await expect(page.getByRole('heading', { name: 'No games found' })).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-06-empty-search.png');
  await page.getByRole('button', { name: 'Show all games' }).click();
  await expect(page.locator('.game-card')).toHaveCount(8);
  await captureEvidence(page, testInfo, 'tc-06-search-reset.png');
});

test('TC-05: category filters and All games restore the collection', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Math/ }).click();
  await expect(page.locator('.game-card')).toHaveCount(1);
  await captureEvidence(page, testInfo, 'tc-05-math-category.png');
  await page.getByRole('button', { name: /All games/ }).click();
  await expect(page.locator('.game-card')).toHaveCount(8);
});

test('TC-07: Math Meteor gives answer feedback and records a score', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Play now/ }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Math Meteor' });
  await expect(dialog).toBeVisible();
  const visual = dialog.locator('.math-visual');
  await expect(visual).toBeVisible();
  await expect(visual.locator('.math-cube')).toHaveCount(12);
  await expect(visual.locator('.math-equation')).toContainText('7 + 5');
  await dialog.getByRole('button', { name: '10', exact: true }).click();
  await expect(dialog.getByText(/Not quite/)).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-07-math-wrong-answer.png', false);
  await dialog.getByRole('button', { name: 'Next question' }).click();
  await expect(visual.locator('.math-equation')).toContainText('18 − 9');
  await expect(visual.locator('.math-cube')).toHaveCount(18);
  await dialog.getByRole('button', { name: '9', exact: true }).click();
  await expect(dialog.getByText(/That’s right/)).toBeVisible();
  await dialog.getByRole('button', { name: 'Next question' }).click();
  await expect(visual.locator('.math-equation')).toContainText('4 × 3');
  await expect(visual.locator('.math-cube')).toHaveCount(12);
  await dialog.getByRole('button', { name: '12', exact: true }).click();
  await expect(dialog.getByText(/That’s right/)).toBeVisible();
  await dialog.getByRole('button', { name: 'See score' }).click();
  await expect(dialog.getByRole('heading', { name: 'Nice playing!' })).toBeVisible();
  await expect(dialog.getByText('2 out of 3')).toBeVisible();
  await captureEvidence(page, testInfo, '03-math-game-result.png', false);
  await dialog.getByRole('button', { name: /Play again/ }).click();
  await expect(dialog.getByText('QUESTION 1 / 3')).toBeVisible();
  await dialog.getByRole('button', { name: 'Close game' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('TC-08: Word Wild handles a wrong answer and completes its rounds', async ({ page }, testInfo) => {
  await page.goto('/');
  const card = page.locator('.game-card').filter({ hasText: 'Word Wild' });
  await card.getByRole('button', { name: /Play now/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Word Wild' });
  const wordImage = dialog.locator('.word-visual-image');
  await expect(wordImage).toBeVisible();
  await expect(wordImage).toHaveAttribute('src', /cat-3d\.svg/);
  await dialog.getByLabel('Your word').fill('dog');
  await dialog.getByRole('button', { name: 'Check word' }).click();
  await expect(dialog.getByText(/word was “cat”/)).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-08-word-wrong-answer.png', false);
  await dialog.getByRole('button', { name: 'Next word' }).click();
  await expect(wordImage).toHaveAttribute('src', /star-3d\.svg/);
  await expect(wordImage).toHaveAttribute('alt', /3D star/);
  await dialog.getByLabel('Your word').fill('star');
  await dialog.getByRole('button', { name: 'Check word' }).click();
  await expect(dialog.getByText(/You got it/)).toBeVisible();
  await dialog.getByRole('button', { name: 'Next word' }).click();
  await expect(wordImage).toHaveAttribute('src', /plain-3d\.svg/);
  await dialog.getByLabel('Your word').fill('plain');
  await dialog.getByRole('button', { name: 'Check word' }).click();
  await expect(dialog.getByText(/You got it/)).toBeVisible();
  await dialog.getByRole('button', { name: 'See score' }).click();
  await expect(dialog.getByRole('heading', { name: 'Nice playing!' })).toBeVisible();
  await expect(dialog.getByText('2 out of 3')).toBeVisible();
  await captureEvidence(page, testInfo, '08-word-game-result.png', false);
});

test('TC-09: Neon Drift handles an early tap and returns a reaction time', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /For grown-ups/ }).click();
  const card = page.locator('.game-card').filter({ hasText: 'Neon Drift' });
  await card.getByRole('button', { name: /Play now/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Neon Drift' });
  await dialog.getByRole('button', { name: 'Tap to start' }).click();
  await dialog.locator('.reflex-zone.waiting').click();
  await expect(dialog.locator('.reflex-zone')).toContainText('Too soon!');
  await captureEvidence(page, testInfo, 'tc-09-neon-early-tap.png', false);
  await dialog.getByRole('button', { name: /Tap to try again/ }).click();
  const signal = dialog.locator('.reflex-zone.go');
  await signal.waitFor({ timeout: 8_000 });
  await signal.click();
  await expect(dialog.locator('.reflex-zone')).toContainText(/\d+ ms/);
  await captureEvidence(page, testInfo, '04-neon-drift-result.png', false);
});

test('TC-14: grown-up adventure and resource games show choice outcomes and recovery evidence', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /For grown-ups/ }).click();
  const story = page.locator('.game-card').filter({ hasText: 'Mythic Realms' });
  await story.getByRole('button', { name: /Play now/ }).click();
  const storyDialog = page.getByRole('dialog', { name: 'Mythic Realms' });
  await storyDialog.getByRole('button', { name: /Follow the bright map/ }).click();
  await expect(storyDialog.getByText(/made a new friend/)).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-14-mythic-choice-result.png', false);
  await storyDialog.getByRole('button', { name: 'Close game' }).click();

  const outpost = page.locator('.game-card').filter({ hasText: 'Outpost Zero' });
  await outpost.getByRole('button', { name: /Play now/ }).click();
  const station = page.getByRole('dialog', { name: 'Outpost Zero' });
  await station.getByRole('button', { name: /Charge solar/ }).click();
  await station.getByRole('button', { name: /Charge solar/ }).click();
  await station.getByRole('button', { name: /Charge solar/ }).click();
  await expect(station.getByText(/Almost!/)).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-14-outpost-failed-plan.png', false);
  await station.getByRole('button', { name: /Try again/ }).click();
  await station.getByRole('button', { name: /Collect parts/ }).click();
  await station.getByRole('button', { name: /Charge solar/ }).click();
  await station.getByRole('button', { name: /Build battery/ }).click();
  await expect(station.getByText(/Station powered/)).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-14-outpost-powered.png', false);
});

test('TC-10: footer has collection links and switches collections', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Grown-up picks' }).click();
  await expect(page.getByRole('heading', { name: 'Games for grown-ups' })).toBeVisible();
  await expect(page.getByText(/general-audience game/i).first()).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-10-footer-navigation.png');
});

test('TC-11: mobile layout fits a narrow phone and is captured as evidence', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('.game-card')).toHaveCount(8);
  const widths = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  await captureEvidence(page, testInfo, '05-kids-mobile.png');
});

test('TC-12: tablet and desktop layouts fit their viewport', async ({ page }, testInfo) => {
  for (const width of [768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const widths = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    expect(widths.document).toBeLessThanOrEqual(widths.viewport);
    await expect(page.locator('.game-card')).toHaveCount(8);
    await captureEvidence(page, testInfo, `tc-12-layout-${width}px.png`);
  }
});

test('TC-13: keyboard focus is visible and Escape closes a game dialog', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const focusStyle = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  expect(focusStyle).not.toBe('none');
  await page.getByRole('button', { name: /Play now/ }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-13-keyboard-game-dialog.png', false);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('TC-18: clicking or keyboard-activating a game card opens its popup', async ({ page }, testInfo) => {
  await page.goto('/');
  const card = page.locator('.game-card').filter({ hasText: 'Gem Runner 3D' });
  await card.locator('.game-art').click();
  const dialog = page.getByRole('dialog', { name: 'Gem Runner 3D' });
  await expect(dialog).toBeVisible();
  await captureEvidence(page, testInfo, 'tc-18-game-card-popup.png', false);
  await dialog.getByRole('button', { name: 'Close game' }).click();
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close game' }).click();
});

test('TC-19: header login opens the Firebase form and footer has About Us', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Log in' }).click();
  const login = page.locator('.login-modal');
  await expect(login.getByLabel('Email address')).toBeVisible();
  await expect(login.getByLabel('Password')).toBeVisible();
  await expect(login.getByLabel('Email address')).toHaveAttribute('required', '');
  await expect(login.getByLabel('Password')).toHaveAttribute('required', '');
  await expect(login.getByRole('button', { name: 'Log in' })).toBeEnabled();
  await captureEvidence(page, testInfo, 'tc-19-login-popup.png', false);
  await login.getByRole('button', { name: /Create an account/ }).click();
  await expect(login.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  await expect(login.getByLabel('Confirm password')).toBeVisible();
  await login.getByRole('button', { name: /Already have an account/ }).click();
  await expect(login.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  await login.getByRole('button', { name: 'Close login' }).click();
  await page.locator('footer').getByRole('link', { name: 'About us' }).click();
  await expect(page).toHaveURL(/#about-us/);
  await expect(page.locator('#about-us')).toContainText('Pixel Pals Arcade');
  await captureEvidence(page, testInfo, 'tc-19-about-us-footer.png', false);
});

test('TC-20: Dino Lab and Planet Pals show a matching 3D-style image for every question', async ({ page }, testInfo) => {
  await page.goto('/');
  const visualRounds = [
    { title: 'Dino Lab', images: ['fossil-3d.svg', 'herbivore-3d.svg', 'footprint-3d.svg'], answers: ['A fossil', 'Herbivore', 'How an animal moved'], screenshot: 'tc-20-dino-visual.png' },
    { title: 'Planet Pals', images: ['earth-3d.svg', 'sun-3d.svg', 'saturn-3d.svg'], answers: ['Earth', 'The Sun', 'Saturn'], screenshot: 'tc-20-planet-visual.png' },
  ];

  for (const game of visualRounds) {
    const card = page.locator('.game-card').filter({ hasText: game.title });
    await card.getByRole('button', { name: /Play now/ }).click();
    const dialog = page.getByRole('dialog', { name: game.title });
    const image = dialog.locator('.question-visual-image');
    for (let index = 0; index < game.images.length; index += 1) {
      await expect(image).toHaveAttribute('src', new RegExp(game.images[index]));
      await expect(image).toBeVisible();
      if (index === 0) await captureEvidence(page, testInfo, game.screenshot, false);
      await dialog.getByRole('button', { name: game.answers[index], exact: true }).click();
      const advance = index === game.images.length - 1 ? 'See score' : 'Next question';
      await dialog.getByRole('button', { name: advance }).click();
    }
    await dialog.getByRole('button', { name: 'Close game' }).click();
  }
});

test('TC-21: Code Camp has easier questions with a 3D-style picture for each step', async ({ page }, testInfo) => {
  await page.goto('/');
  const card = page.locator('.game-card').filter({ hasText: 'Code Camp' });
  await card.getByRole('button', { name: /Play now/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Code Camp' });
  const image = dialog.locator('.question-visual-image');
  const rounds = [
    { image: 'number-blocks-3d.svg', answer: '4', screenshot: 'tc-21-code-camp-pattern.png' },
    { image: 'robot-steps-3d.svg', answer: '2', screenshot: 'tc-21-code-camp-robot.png' },
    { image: 'repeat-loop-3d.svg', answer: 'Repeat', screenshot: 'tc-21-code-camp-loop.png' },
  ];
  for (let index = 0; index < rounds.length; index += 1) {
    await expect(image).toHaveAttribute('src', new RegExp(rounds[index].image));
    await expect(image).toBeVisible();
    await captureEvidence(page, testInfo, rounds[index].screenshot, false);
    await dialog.getByRole('button', { name: rounds[index].answer, exact: true }).click();
    await expect(dialog.getByText(/That’s right/)).toBeVisible();
    await dialog.getByRole('button', { name: index === rounds.length - 1 ? 'See score' : 'Next question' }).click();
  }
  await expect(dialog.getByRole('heading', { name: 'Amazing work!' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Close game' }).click();
});
