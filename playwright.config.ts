import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  globalSetup: "./e2e/global-setup.ts",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // setup pour générer les storageState
    {
      name: "setup",
      testMatch: /.*\.setup\.ts$/,
    },
    // tests publics (inscription, onboarding, auth, etc.)
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
    // tests accès glaneur
    {
      name: "gleaner",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: [/.*gleaner.*\.e2e\.ts$/, /.*gleaning\.e2e\.ts$/],
    },
    // tests accès farmer
    {
      name: "farmer",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/farmer.json",
      },
      dependencies: ["setup"],
      testMatch: [/.*farmer.*\.e2e\.ts$/, /.*gleaning\.e2e\.ts$/],
    },
    // tests accès admin
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
  },
});
