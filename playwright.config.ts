import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  retries: 1,
  workers: 1,
  reporter: process.env.CI ? "github" : "html",
  globalSetup: "./e2e/global-setup.ts",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 25_000,
    navigationTimeout: 35_000,
  },

  expect: {
    timeout: 20_000,
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts$/,
      timeout: 120_000,
    },
    {
      name: "public",
      use: { ...devices["Desktop Chrome"] },
      testMatch: [
        /.*auth\.e2e\.ts$/,
        /.*onboarding\.e2e\.ts$/,
        /.*announcement\.e2e\.ts$/,
      ],
      testIgnore: [
        /.*farmer.*\.e2e\.ts$/,
        /.*admin.*\.e2e\.ts$/,
        /.*gleaner.*\.e2e\.ts$/,
        /.*gleaning\.e2e\.ts$/,
        /.*\.setup\.ts$/,
      ],
    },
    {
      name: "gleaner",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: [/.*gleaner.*\.e2e\.ts$/, /.*gleaning\.e2e\.ts$/],
    },
    {
      name: "farmer",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/farmer.json",
      },
      dependencies: ["setup"],
      testMatch: [/.*farmer.*\.e2e\.ts$/, /.*gleaning\.e2e\.ts$/],
    },
    {
      name: "admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/admin.json",
      },
      dependencies: ["setup"],
      testMatch: [/.*admin.*\.e2e\.ts$/],
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
  },
});
