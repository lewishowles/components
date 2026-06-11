import { alias } from "./support/aliases.js";
import { createNamedExports } from "./support/plugins/index.js";
import { defineConfig } from "cypress";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	allowCypressEnv: false,
	fixturesFolder: "",
	screenshotOnRunFailure: false,
	video: false,
	viewportWidth: 1440,
	viewportHeight: 900,

	component: {
		specPattern: "src/components/**/*.cy.js",
		indexHtmlFile: "test/cypress/support/component-index.html",
		supportFile: "test/cypress/support/component.js",
		devServer: {
			framework: "vue",
			bundler: "vite",
			viteConfig: {
				plugins: [vue(), tailwindcss(), createNamedExports()],
				resolve: {
					alias,
				},
			},
		},
		viewportWidth: 1000,
		viewportHeight: 1000,
	},
});
