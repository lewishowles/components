import { componentManifest } from "virtual:components-manifest";

/**
 * A resolver for `unplugin-vue-components`. Used in a project's Vite config, it
 * lets templates reference any library component by tag (`<ui-button>`) with
 * no import line, while keeping imports tree-shakeable: only components a
 * template actually uses are pulled in.
 *
 * Auto-import runs at build time; global registration via `install()` runs at
 * runtime, so the two can't see each other. If you globally register an
 * override under a component's tag, pass that tag to `exclude` so the resolver
 * skips it and your registration wins. Drive both your registration and
 * `exclude` from one object to keep them in sync:
 *
 *     const overrides = { "ui-button": MyButton };
 *     // main.js — register globally
 *     Object.entries(overrides).forEach(([name, c]) => app.component(name, c));
 *     // vite.config — exclude the same tags
 *     componentsResolver({ exclude: Object.keys(overrides) })
 *
 * @param  {object}  [options]
 *     Resolver options.
 * @param  {string[]}  [options.exclude]
 *     Component tags (`"ui-button"`) or export names (`"UiButton"`) to skip, so
 *     a globally registered override takes precedence.
 */
export function componentsResolver(options = {}) {
	const exclude = new Set(options.exclude ?? []);
	const names = new Set();

	for (const { tag, name } of componentManifest) {
		if (exclude.has(tag) || exclude.has(name)) {
			continue;
		}

		names.add(name);
	}

	return {
		type: "component",

		resolve(name) {
			if (names.has(name)) {
				return { name, from: "@lewishowles/components" };
			}
		},
	};
}
