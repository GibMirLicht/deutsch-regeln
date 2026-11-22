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
