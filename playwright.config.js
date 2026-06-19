const { defineConfig, devices } = require('@playwright/test');

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

module.exports = defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'list' : 'html',

    use: {
        baseURL: BASE_URL,
        trace: 'on-first-retry'
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ],

    // The demo page loads the freshly built bundle from `../dist`, so the
    // bundle must be built before the static server starts.
    webServer: {
        command: `npm run build && npx http-server . -p ${PORT} -c-1 --silent`,
        url: BASE_URL,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI
    }
});
