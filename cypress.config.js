import { defineConfig } from "cypress";
import viteConfig from "./vite.config";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

const baseViteConfig = await viteConfig;

export default defineConfig({
	allowCypressEnv: false,
	fixturesFolder: "",
	screenshotOnRunFailure: false,
	video: false,
	viewportWidth: 1440,
	viewPortHeight: 900,

	component: {
		specPattern: "src/components/**/*.cy.js",
		indexHtmlFile: "test/cypress/support/component-index.html",
		supportFile: "test/cypress/support/component.js",
		devServer: {
			framework: "vue",
			bundler: "vite",
			viteConfig: {
				...baseViteConfig,
				plugins: [tailwindcss(), vue()],
			},
		},
		viewportWidth: 1000,
		viewPortHeight: 1000,
	},
});
