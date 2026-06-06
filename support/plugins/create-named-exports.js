import { getComponentManifest } from "../component-manifest.js";

// `virtual:components-named`: static default re-exports, one per component,
// re-exported from `src/index.js` so consumers can tree-shake named imports.
const NAMED_ID = "virtual:components-named";

// `virtual:components-manifest` — the `[{ tag, name }]` table baked into the
// `unplugin-vue-components` resolver so it can map tags to library exports
// without reading our source at the consumer's build time.
const MANIFEST_ID = "virtual:components-manifest";

const resolved = (id) => `\0${id}`;

/**
 * Provide the two generated modules that let projects import only the
 * components they actually use. Both are built from the same list of
 * components.
 *
 * - `virtual:components-named` — `export { default as Name } from "…"` for
 * every component. The `install()` plugin registers everything via an eager
 * glob (not tree-shakeable); these static re-exports let a consumer's bundler
 * keep one component and drop the rest.
 *
 * - `virtual:components-manifest` — the `[{ tag, name }]` table consumed by the
 * resolver entry, inlined into `dist/resolver.js` at build time.
 */
export function createNamedExports() {
	return {
		name: "create-named-exports",

		resolveId(id) {
			if (id === NAMED_ID || id === MANIFEST_ID) {
				return resolved(id);
			}
		},

		load(id) {
			if (id === resolved(NAMED_ID)) {
				return getComponentManifest()
					.map(({ name, path }) => `export { default as ${name} } from ${JSON.stringify(path)};`)
					.join("\n");
			}

			if (id === resolved(MANIFEST_ID)) {
				const manifest = getComponentManifest().map(({ tag, name }) => ({ tag, name }));

				return `export const componentManifest = ${JSON.stringify(manifest)};`;
			}
		},
	};
}
