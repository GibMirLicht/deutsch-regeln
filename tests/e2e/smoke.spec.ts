import { expect, test } from '@playwright/test';

test('home page: Russian UI, noindex, all assets load under base', async ({ page }) => {
  const failed: string[] = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', (request) => failed.push(`failed ${request.url()}`));

  const response = await page.goto('./');
  expect(response?.status()).toBe(200);

  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('heading', { level: 1, name: 'Deutsch-Regeln' })).toBeVisible();
  // Starlight UI strings come from the Russian translation.
  await expect(page.getByRole('button', { name: 'Поиск' })).toBeVisible();

  await page.waitForLoadState('networkidle');
  expect(failed).toEqual([]);
});
