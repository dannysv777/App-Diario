import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: process.env.TEST_URL ?? "http://localhost:3045",
    channel: process.env.TEST_BROWSER ?? "msedge",
    viewport: { width: 390, height: 844 },
    screenshot: "only-on-failure",
  },
});
