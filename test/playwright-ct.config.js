import { alias } from "../support/aliases.js";
import { componentAutoImports } from "../support/plugins/component-auto-imports.js";
import { createNamedExports } from "../support/plugins/create-named-exports.js";
import { defineConfig, devices } from "@playwright/experimental-ct-vue";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

/** Absolute path to this config file's directory, used to resolve project paths. */
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	testDir: join(__dirname, "../src/components"),
	testMatch: "**/*.pw.js",
	fullyParallel: true,
	workers: process.env.CI ? 2 : undefined,
	use: {
		testIdAttribute: "data-test",
		ctPort: 3100,
		ctTemplateDir: "ct",
		ctViteConfig: {
			plugins: [componentAutoImports(), createNamedExports(), tailwindcss(), vue()],
			resolve: { alias },
		},
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
