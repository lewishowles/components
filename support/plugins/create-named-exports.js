import { getComponentManifest } from "../component-manifest.js";

// `virtual:components-named`: static default re-exports, one per component,
// re-exported from `src/index.js` so consumers can tree-shake named imports.
const NAMED_ID = "virtual:components-named";

// `virtual:components-manifest` — the `[{ tag, name }]` table baked into the
// `unplugin-vue-components` resolver so it can map tags to library exports
// without reading our source at the consumer's build time.
const MANIFEST_ID = "virtual:components-manifest";

// `virtual:component-icons` — the runtime icon registry used by components
// that accept icon names as strings.
const ICONS_ID = "virtual:component-icons";

const resolved = (id) => `\0${id}`;

/**
 * Provide the generated modules that let projects import only the
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
 *
 * - `virtual:component-icons` — the `[{ tag, component }]` map used internally
 * by components that accept icon component names as string props.
 */
export function createNamedExports() {
	return {
		name: "create-named-exports",

		resolveId(id) {
			if (id === NAMED_ID || id === MANIFEST_ID || id === ICONS_ID) {
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

			if (id === resolved(ICONS_ID)) {
				const icons = getComponentManifest().filter(({ tag }) => tag.startsWith("icon-"));
				const entries = icons.map(({ tag, name }) => `${JSON.stringify(tag)}: ${name}`).join(",\n");

				const imports = icons
					.map(({ name, path }) => `import ${name} from ${JSON.stringify(path)};`)
					.join("\n");

				return `${imports}\n\nexport const componentIcons = {\n${entries}\n};`;
			}
		},
	};
}
