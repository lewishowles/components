/**
 * Create a stylesheet that registers the built components as a Tailwind source,
 * so a consumer's Tailwind generates the utility classes the component
 * templates reference.
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
		},
	};
}
