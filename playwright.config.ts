import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  workers: 1, // ✅ pas de parallélisme => pas de conflit
  
  reporter: [
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["list"]
  ],
  use: {
    baseURL: "http://localhost:3001",
    trace: "retain-on-failure" // super utile même en API tests
  },
  webServer: {
    command: "npm --prefix ../farm-api run dev",
    url: "http://localhost:3001/api/health",
    reuseExistingServer: true,
    timeout: 60_000,
  },

  projects: [
    {
      name: "api-tests"
    }
  ]
});