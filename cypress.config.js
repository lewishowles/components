import { defineConfig } from "cypress";

export default defineConfig({
	fixturesFolder: "test/fixtures",
	screenshotsFolder: "test/cypress/screenshots",
	videosFolder: "test/cypress/videos",
	viewportWidth: 1440,
	viewPortHeight: 900,

	component: {
		specPattern: "src/components/**/*.cy.js",
		indexHtmlFile: "test/cypress/support/component-index.html",
		supportFile: "test/cypress/support/component.js",
		devServer: {
			framework: "vue",
			bundler: "vite",
		},
		viewportWidth: 1000,
		viewPortHeight: 1000,
	},
});
