const { test, expect } = require('@playwright/test');

const FIXTURE = '/e2e/fixtures/index.html';

// Editors keep the document order of the source `<pre>` elements.
const DEFAULT = 0;
const SKIN_BLUE = 1;
const LAYOUT_VERTICAL = 2;
const MAXIMIZE = 3;

test.describe('options from data-* attributes', () => {
    test('data-skin defaults to normal and can be set to blue', async ({ page }) => {
        await page.goto(FIXTURE);

        const editors = page.locator('.executor');
        await expect(editors.nth(DEFAULT)).toHaveClass(/skin-normal/);
        await expect(editors.nth(SKIN_BLUE)).toHaveClass(/skin-blue/);
    });

    test('data-layout default is horizontal (column mode)', async ({ page }) => {
        await page.goto(FIXTURE);

        await expect(page.locator('.executor').nth(DEFAULT)).toHaveClass(/executor-column-mode/);
    });

    test('data-layout="vertical" drops column mode (stacked)', async ({ page }) => {
        await page.goto(FIXTURE);

        await expect(page.locator('.executor').nth(LAYOUT_VERTICAL)).not.toHaveClass(/executor-column-mode/);
    });

    test('data-maximize="true" hides the result panel', async ({ page }) => {
        await page.goto(FIXTURE);

        const editor = page.locator('.executor').nth(MAXIMIZE);
        await expect(editor).toHaveClass(/executor-maximize-mode/);
        await expect(editor.locator('.executor-result')).toBeHidden();
    });

    test('default editors keep the result panel visible', async ({ page }) => {
        await page.goto(FIXTURE);

        await expect(page.locator('.executor').nth(DEFAULT).locator('.executor-result')).toBeVisible();
    });

    test('data-autofocus focuses the editable code area', async ({ page }) => {
        await page.goto(FIXTURE);

        const focusedHasCode = await page.evaluate(() => {
            const active = document.activeElement;
            return !!active && active.closest('.executor-editor') !== null;
        });
        expect(focusedHasCode).toBe(true);
    });
});
