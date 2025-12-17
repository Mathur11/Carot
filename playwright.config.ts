import { defineConfig } from '@playwright/test';


/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = defineConfig({
  testDir: './tests/',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  reporter: 'html',
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'on',
    launchOptions: {
      args: ['--start-maximized']
    },
    viewport: null,





  },
});
export default config;
