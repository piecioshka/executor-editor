const { test, expect } = require('@playwright/test');

const FIXTURE = '/e2e/fixtures/index.html';

const DEFAULT = 0;

test.describe('toolbar interactions', () => {
    test('Switch layout toggles column mode', async ({ page }) => {
        await page.goto(FIXTURE);

        const editor = page.locator('.executor').nth(DEFAULT);
        await expect(editor).toHaveClass(/executor-column-mode/);

        await editor.locator('.executor-layout-switcher-button').click();
        await expect(editor).not.toHaveClass(/executor-column-mode/);

        await editor.locator('.executor-layout-switcher-button').click();
        await expect(editor).toHaveClass(/executor-column-mode/);
    });

    test('Maximize toggles maximize mode and result visibility', async ({ page }) => {
        await page.goto(FIXTURE);

        const editor = page.locator('.executor').nth(DEFAULT);
        const result = editor.locator('.executor-result');
        await expect(editor).not.toHaveClass(/executor-maximize-mode/);
        await expect(result).toBeVisible();

        await editor.locator('.executor-maximize-button').click();
        await expect(editor).toHaveClass(/executor-maximize-mode/);
        await expect(result).toBeHidden();

        await editor.locator('.executor-maximize-button').click();
        await expect(editor).not.toHaveClass(/executor-maximize-mode/);
        await expect(result).toBeVisible();
    });

    test('Maximize after Switch layout is not overridden by inline sizes', async ({ page }) => {
        await page.goto(FIXTURE);

        const editor = page.locator('.executor').nth(DEFAULT);

        // Switch layout sets inline width/height on the editor.
        await editor.locator('.executor-layout-switcher-button').click();
        // Maximize must clear those so its CSS (editor at 100%) takes effect.
        await editor.locator('.executor-maximize-button').click();

        await expect(editor).toHaveClass(/executor-maximize-mode/);
        const inlineWidth = await editor.locator('.executor-editor').evaluate((el) => el.style.width);
        expect(inlineWidth).toBe('');
    });

    test('autoevaluate checkbox is checked when data-autoevaluate is true', async ({ page }) => {
        await page.goto(FIXTURE);

        // Editor index 5 has data-autoevaluate="true".
        const editor = page.locator('.executor').nth(5);
        await expect(editor.locator('.executor-autoevaluate-checkbox')).toBeChecked();
    });

    test('autoevaluate checkbox is unchecked when data-autoevaluate is false', async ({ page }) => {
        await page.goto(FIXTURE);

        const editor = page.locator('.executor').nth(DEFAULT);
        await expect(editor.locator('.executor-autoevaluate-checkbox')).not.toBeChecked();
    });
});
