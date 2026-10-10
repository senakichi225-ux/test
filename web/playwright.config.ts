import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// E2E テストの登録データは、本物の保存先とは別のファイルに書く
export const E2E_WAITLIST_FILE = path.join(__dirname, "test-results", "e2e-waitlist.json");

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
    env: {
      WAITLIST_FILE: E2E_WAITLIST_FILE,
      RESEARCH_BASIC_AUTH: "e2e:secret",
    },
  },
});
