import { expect, test } from '@playwright/test';

test.describe('rule tree and translation toggle', () => {
  test('tree: label opens the article, arrow only opens or closes the list', async ({ page, isMobile }) => {
    await page.goto('satz/satzglieder/subjekt/');
    // No "On this page" list, no page for the root section.
    await expect(page.getByText('На этой странице')).toHaveCount(0);
    if (isMobile) await page.locator('button.sl-menu-button').click();

    const tree = page.getByRole('navigation', { name: 'Дерево правил' });
    const branch = tree.locator('li[data-tree-id="satz/satzglieder"]');
    const toggle = branch.locator('[data-tree-toggle]').first();
    await expect(tree.getByRole('link', { name: /1\.1\.1\s+Subjekt/ })).toHaveAttribute('aria-current', 'page');

    // The branch of the current page starts open; the arrow closes it and the page stays the same.
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(tree.getByRole('link', { name: /Subjekt/ })).toBeHidden();
    await expect(page).toHaveURL(/\/satz\/satzglieder\/subjekt\/$/);
    await toggle.click();
    await expect(tree.getByRole('link', { name: /Prädikat/ })).toBeVisible();

    // The label opens the article.
    await tree.getByRole('link', { name: /1\.1\s+Satzglieder/ }).click();
    await expect(page).toHaveURL(/\/satz\/satzglieder\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Satzglieder');
  });

  test('translations hide with one button and stay hidden after reload', async ({ page }) => {
    await page.goto('satz/satzglieder/');
    const translation = page.locator('main .bi p.tr').first();
    const toggle = page.locator('header .tr-toggle');
    await expect(translation).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(translation).toBeHidden();
    await expect(page.locator('main table.bitable .tr').first()).toBeHidden();
    await expect(page.locator('h1 .tr')).toBeHidden();

    await page.reload();
    await expect(page.locator('main .bi p.tr').first()).toBeHidden();
    await page.locator('header .tr-toggle').click();
    await expect(page.locator('main .bi p.tr').first()).toBeVisible();
  });
});

test('R key toggles translations; typing in search does not', async ({ page, isMobile }) => {
  test.skip(isMobile, 'phones have no keyboard shortcut');
  await page.goto('satz/satzglieder/praedikat/');
  const translation = page.locator('main .bi p.tr').first();
  await expect(translation).toBeVisible();
  await page.keyboard.press('r');
  await expect(translation).toBeHidden();
  await page.keyboard.press('r');
  await expect(translation).toBeVisible();
  // Typed in letter by letter, then complete.
  await expect(translation).toHaveText('Сказуемое состоит из спрягаемого глагола и его частей.');

  // In the search field, R is just a letter.
  await page.keyboard.press('Control+k');
  await page.locator('dialog[open] input').first().waitFor();
  await page.keyboard.type('r');
  await expect(page.locator('dialog[open] input').first()).toHaveValue('r');
  await page.keyboard.press('Escape');
  await expect(translation).toBeVisible();
});

test('no previous/next links under articles', async ({ page }) => {
  await page.goto('satz/satzglieder/subjekt/');
  await expect(page.getByText('Предыдущая')).toHaveCount(0);
  await expect(page.getByText('Следующая')).toHaveCount(0);
});
