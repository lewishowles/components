import { fileURLToPath, URL } from "node:url";
import { readFileSync, readdirSync } from "node:fs";

// Stylesheets that are only used in the docs site and should not be shipped in
// the package distribution.
const DOCS_ONLY_STYLESHEETS = ["docs.css", "font.css"];

/**
 * Publish the library's stylesheets under `/css/`. Used in two contexts:
 *
 * - Package build: emits individual sheets to `dist/css/` so consumers can
 *   import or copy them via the CLI.
 * - Docs build: serves sheets in dev and emits them for the docs site download
 *   links on the theming page.
 */
export function publishStylesheets() {
	const stylesheetDirectory = fileURLToPath(new URL("../../src/assets/css", import.meta.url));

	// Every stylesheet the library ships (docs-only sheets excluded).
	const stylesheetFiles = readdirSync(stylesheetDirectory).filter(
		(file) => file.endsWith(".css") && !DOCS_ONLY_STYLESHEETS.includes(file),
	);

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
