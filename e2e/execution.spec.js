const { test, expect } = require('@playwright/test');

const FIXTURE = '/e2e/fixtures/index.html';

const AUTOEVAL = 5;
const MANUAL = 6;

test.describe('code execution and result', () => {
    test('auto-evaluated editor prints its output on load', async ({ page }) => {
        await page.goto(FIXTURE);

        const consoleEl = page.locator('.executor').nth(AUTOEVAL).locator('.executor-result-console');
        await expect(consoleEl).toContainText('hello');
    });

    test('Execute button runs the code on demand', async ({ page }) => {
        await page.goto(FIXTURE);

        const editor = page.locator('.executor').nth(MANUAL);
        const consoleEl = editor.locator('.executor-result-console');

        await expect(consoleEl).toBeEmpty();
        await editor.locator('.executor-execute-button').click();
        await expect(consoleEl).toContainText('manual');
    });

    test('runtime errors are rendered in the error style', async ({ page }) => {
        await page.goto(FIXTURE);

        const editor = page.locator('.executor').nth(MANUAL);
        const code = editor.locator('.executor-editor code');

        // Replace the code with something that throws, typing so the editor
        // registers the change, then run it.
        await code.click();
        await page.keyboard.press('Control+A');
        await code.pressSequentially('throw new Error("boom");');
        await editor.locator('.executor-execute-button').click();

        await expect(editor.locator('.executor-result-console .executor-error')).toContainText('boom');
    });
});
