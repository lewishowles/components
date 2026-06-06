import { getComponentManifest } from "../component-manifest.js";

const VIRTUAL_ID = "virtual:components-named";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * Expose every component as a static, individually importable named export.
 *
 * The library's `install()` plugin registers everything globally via an eager
 * glob, which can't be tree-shaken. This plugin emits a sibling module of plain
 * `export { default as Name } from "…"` statements so a consumer's bundler can
 * pull a single component and drop the rest. `src/index.js` re-exports it with
 * `export * from "virtual:components-named"`.
 */
export function createNamedExports() {
	return {
		name: "create-named-exports",

		resolveId(id) {
			if (id === VIRTUAL_ID) {
				return RESOLVED_ID;
			}
		},

		load(id) {
			if (id !== RESOLVED_ID) {
				return;
			}

			return getComponentManifest()
				.map(({ name, path }) => `export { default as ${name} } from ${JSON.stringify(path)};`)
				.join("\n");
		},
	};
}
