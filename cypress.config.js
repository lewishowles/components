import { defineConfig } from "cypress";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

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
				plugins: [vue(), tailwindcss()],
				resolve: {
					alias: {
						"@": fileURLToPath(new URL("./src", import.meta.url)),
						"@cypress": fileURLToPath(new URL("./test/cypress", import.meta.url)),
						"@unit": fileURLToPath(new URL("./test/unit", import.meta.url)),
					},
				},
			},
		},
		viewportWidth: 1000,
		viewPortHeight: 1000,
	},
});
