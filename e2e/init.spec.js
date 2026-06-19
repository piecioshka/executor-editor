const { test, expect } = require('@playwright/test');

const FIXTURE = '/e2e/fixtures/index.html';

test.describe('initialization and render', () => {
    test('replaces every <pre> with a rendered editor', async ({ page }) => {
        await page.goto(FIXTURE);

        // The fixture declares 7 editors.
        await expect(page.locator('.executor')).toHaveCount(7);
    });

    test('each editor renders toolbar, editor and result panels', async ({ page }) => {
        await page.goto(FIXTURE);

        const first = page.locator('.executor').first();
        await expect(first.locator('.executor-toolbar')).toHaveCount(1);
        await expect(first.locator('.executor-editor')).toHaveCount(1);
        await expect(first.locator('.executor-result')).toHaveCount(1);
    });

    test('toolbar exposes the expected controls', async ({ page }) => {
        await page.goto(FIXTURE);

        const first = page.locator('.executor').first();
        await expect(first.locator('.executor-autoevaluate-checkbox')).toHaveCount(1);
        await expect(first.locator('.executor-layout-switcher-button')).toHaveCount(1);
        await expect(first.locator('.executor-maximize-button')).toHaveCount(1);
        await expect(first.locator('.executor-execute-button')).toHaveCount(1);
    });

    test('loads without console errors', async ({ page }) => {
        const errors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto(FIXTURE);
        await expect(page.locator('.executor').first()).toBeVisible();

        expect(errors).toEqual([]);
    });
});
