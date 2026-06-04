import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

/**
 * Publish the library's stylesheets alongside the docs so that the theming page
 * can link to current copies as a starting point.
 */
function publishStylesheets() {
	const stylesheetDirectory = fileURLToPath(new URL("./src/assets/css", import.meta.url));
	// Every stylesheet the library ships.
	const stylesheetFiles = readdirSync(stylesheetDirectory).filter((file) => file.endsWith(".css"));

	return {
		name: "publish-stylesheets",

		configureServer(server) {
			for (const file of stylesheetFiles) {
				server.middlewares.use(`/css/${file}`, (request, response) => {
					response.setHeader("Content-Type", "text/css");
					response.end(readFileSync(`${stylesheetDirectory}/${file}`, "utf8"));
				});
			}
		},

		generateBundle() {
			for (const file of stylesheetFiles) {
				this.emitFile({
					type: "asset",
					fileName: `css/${file}`,
					source: readFileSync(`${stylesheetDirectory}/${file}`, "utf8"),
				});
			}
		},
	};
}

export default defineConfig({
	plugins: [vue(), tailwindcss(), publishStylesheets()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@cypress": fileURLToPath(new URL("./test/cypress", import.meta.url)),
			"@unit": fileURLToPath(new URL("./test/unit", import.meta.url)),
		},
	},
	build: {
		outDir: "dist-docs",
	},
});
