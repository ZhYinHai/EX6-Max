const { test, expect } = require('@playwright/test');

test('NexLinq loads and updates the virtual display', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/?feature=nexlinq');

  await expect(page.locator('[data-ex6-page]')).toBeVisible();
  await expect(page.locator('#ex6-nexlinq')).toBeVisible();
  await expect(page.locator('[data-screen]')).toBeVisible();

  const space = page.locator('.ex6-lcd-background--space');
  const nature = page.locator('.ex6-lcd-background--nature');
  await expect(space).toHaveAttribute('aria-pressed', 'true');
  await nature.click();
  await expect(nature).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-screen-panel="thermal"]')).toHaveClass(/has-lcd-background/);

  await page.locator('[data-lcd-upload]').setInputFiles({
    name: 'smoke.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64',
    ),
  });
  await expect(page.locator('[data-lcd-upload-label]')).toHaveText('Uploaded image');
  await expect(page.locator('[data-screen-panel="thermal"]')).toHaveClass(/has-lcd-background/);

  expect(pageErrors).toEqual([]);
});
