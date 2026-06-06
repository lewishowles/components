import { getComponentManifest } from "../component-manifest.js";

/**
 * Helps bundled components bring their own child components with them.
 *
 * Some library components use other library components inside their template,
 * such as `<ui-button>` or `<form-layout>`. Without this resolver, those child
 * components are only found if the whole library has been registered globally.
 * That means automatic imports can pull in the parent component but leave its
 * children missing.
 *
 * This resolver connects those internal component tags to their source files
 * while the library is being built. Each component then imports the children it
 * actually uses, so it works on its own and can still be tree-shaken.
 *
 * The component list comes from `getComponentManifest()`, which also feeds the
 * library exports and the public resolver, keeping all three in step.
 */
export function internalComponentsResolver() {
	const byName = new Map();

	for (const { tag, name, path } of getComponentManifest()) {
		byName.set(tag, path);
		byName.set(name, path);
	}

	return {
		type: "component",

		resolve(name) {
			const path = byName.get(name);

			if (path) {
				return { from: path };
			}
		},
	};
}
