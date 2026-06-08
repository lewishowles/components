/**
 * Create stylesheets that register the built components as a Tailwind source.
 *
 * - `source.css` — just the @source scan path, for consumers who compose their
 *   own stylesheet from individual ./styles/* imports.
 * - `styles.css` — the composed entry: imports the full consumer baseline
 *   (main.css and its partials) plus the source scan. The one-import common
 *   case: `@import "@lewishowles/components/styles"`.
 */
export function createComponentSource() {
	return {
		name: "create-component-source",

		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "source.css",
				source: `@source "./components.js";\n`,
			});

			this.emitFile({
				type: "asset",
				fileName: "styles.css",
				source: `@import "./css/main.css";\n@source "./components.js";\n`,
			});
		},
	};
}
