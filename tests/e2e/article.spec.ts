import { expect, test } from '@playwright/test';

test('article page: German text with Russian translation, bilingual tables, sentence analysis', async ({ page }) => {
  await page.goto('satz/satzglieder/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Satzglieder');
  await expect(page.locator('h1 .tr[lang="ru"]')).toHaveText('Члены предложения');

  // A paragraph: German first, its Russian translation right below.
  const para = page.locator('.bi').first();
  await expect(para.locator('p.de[lang="de"]')).toContainText('Ein Satzglied besteht');
  await expect(para.locator('p.tr[lang="ru"]')).toContainText('Член предложения состоит');

  // Table cells hold the translation in the same cell, in italics.
  const cell = page.locator('table.bitable td').filter({ hasText: 'Subjekt' }).first();
  await expect(cell.locator('.tr[lang="ru"]')).toHaveText('Подлежащее');
  await expect(cell.locator('.tr')).toHaveCSS('font-style', 'italic');

  // Sentence analysis: every part carries its label; the translation follows.
  const row = page.locator('.analysis-row').first();
  await expect(row.locator('.part-cell')).toHaveCount(4);
  await expect(row.locator('.part-cell').first()).toContainText('Subjekt');
  await expect(row.locator('.part-cell').first()).toContainText('подлежащее');
  await expect(row.locator('.part-cell').first().locator('.part')).toHaveText('Anna');
  await expect(row.locator('.translation')).toContainText('Анна сегодня покупает хлеб.');

  // Nothing overflows the viewport sideways (phone included).
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  // Links to the subsections use the base path.
  await page.locator('ul.children').getByRole('link', { name: 'Prädikat' }).click();
  await expect(page).toHaveURL(/\/deutsch-regeln\/satz\/satzglieder\/praedikat\/$/);
  await expect(page.locator('table.bitable tbody tr')).toHaveCount(8);
});
