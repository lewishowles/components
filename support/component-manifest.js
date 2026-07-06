import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { toPascalCase } from "@lewishowles/helpers/string";

const componentsRoot = fileURLToPath(new URL("../src/components", import.meta.url));

/**
 * Walk `src/components`, collecting every public `.vue` file. Test fixtures are
 * excluded.
 *
 * Each entry pairs the registered tag, its PascalCase export name, and an
 * absolute path to the source file. Both the named-export plugin and the
 * `unplugin-vue-components` resolver derive their mappings from this scan.
 *
 * @returns  {Array<{ tag: string, name: string, path: string }>}
 */
export function getComponentManifest() {
	const manifest = [];

	function walk(directory) {
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const entryPath = path.join(directory, entry.name);

			if (entry.isDirectory()) {
				// Skip test fixtures, which aren't used as part of the actual
				// library.
				if (entry.name === "test-fixtures") {
					continue;
				}

				walk(entryPath);

				continue;
			}

			if (!entry.name.endsWith(".vue") || entry.name.endsWith(".fixture.vue")) {
				continue;
			}

			const tag = entry.name.replace(/\.vue$/, "");

			manifest.push({ tag, name: toPascalCase(tag), path: entryPath });
		}
	}

	walk(componentsRoot);

	return manifest.sort((a, b) => a.name.localeCompare(b.name));
}
