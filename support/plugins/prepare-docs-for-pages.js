import { copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Prepare the docs build for GitHub Pages: copy index.html to 404.html so
 * client-side routes resolve on a hard refresh, and add a .nojekyll file so
 * paths beginning with an underscore are served.
 */
export function prepareDocsForPages() {
	let outputDirectory;

	return {
		name: "prepare-docs-for-pages",
		apply: "build",

		configResolved(config) {
			outputDirectory = resolve(config.root, config.build.outDir);
		},

		closeBundle() {
			copyFileSync(`${outputDirectory}/index.html`, `${outputDirectory}/404.html`);
			writeFileSync(`${outputDirectory}/.nojekyll`, "");
		},
	};
}
