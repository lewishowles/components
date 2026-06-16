// @vitest-environment node
import { describe, expect, test } from "vite-plus/test";
import { createCheckerByJson } from "vue-component-meta";
import { readdirSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { join } from "node:path";
import { componentMetadata } from "./component-metadata.js";

const root = fileURLToPath(new URL("../..", import.meta.url));

// Props injected by Vue globally — not authored by components.
const globalPropNames = new Set(["class", "style", "key", "ref", "ref_key", "ref_for"]);

// Props that are part of the v-model contract or internal testing hooks — not consumer-facing API.
const internalPropNames = new Set(["modelValue", "onUpdate:modelValue", "dataTest"]);

const checker = createCheckerByJson(root, {
	include: ["src/**/*.vue"],
	compilerOptions: {
		allowJs: true,
		checkJs: false,
		paths: {
			"@/*": ["./src/*"],
		},
	},
});

// Build a map of component name → absolute path by scanning .vue files.
// Excludes fragment and example sub-directories which are not registered components.
const componentsDir = fileURLToPath(new URL(".", import.meta.url));

const componentFileMap = buildComponentFileMap(componentsDir);

// First call warms the TypeScript program (~7s); subsequent calls are fast.
describe("component-metadata completeness", { timeout: 30000 }, () => {
	for (const component of componentMetadata) {
		const filePath = componentFileMap[component.name];

		// Skip components without a discoverable source file — they may be
		// virtual or aliased components not following the standard naming pattern.
		if (!filePath) {
			continue;
		}

		test(`${component.name} — all props covered`, () => {
			const meta = checker.getComponentMeta(filePath);

			const extractedPropNames = meta.props
				.filter((prop) => !prop.global)
				.filter((prop) => !globalPropNames.has(prop.name))
				.filter((prop) => !internalPropNames.has(prop.name))
				.map((prop) => prop.name);

			const metadataPropNames = new Set(component.props?.map((p) => p.name) ?? []);

			const missing = extractedPropNames.filter((name) => !metadataPropNames.has(name));

			expect(
				missing,
				`Props in ${component.name}.vue but not in metadata: ${missing.join(", ")}`,
			).toEqual([]);
		});
	}
});

/**
 * Recursively scan a directory for .vue files, returning a map of component
 * name to absolute path. Fragment and example sub-directories are excluded
 * as they contain internal components not registered in the metadata.
 *
 * @param  {string}  dir
 *     Root directory to scan.
 * @returns {Record<string, string>}
 */
function buildComponentFileMap(dir) {
	const map = {};

	for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
		if (!entry.isFile() || !entry.name.endsWith(".vue")) {
			continue;
		}

		const parentPath = entry.parentPath ?? entry.path;

		if (parentPath.includes("/fragments/") || parentPath.includes("/examples/")) {
			continue;
		}

		const name = entry.name.replace(".vue", "");

		map[name] = join(parentPath, entry.name);
	}

	return map;
}
