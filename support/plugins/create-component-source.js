/**
 * Create a stylesheet that registers the built components as a Tailwind source.
 * Consumers import it once — `@import "@lewishowles/components/source"` — and
 * Tailwind generates the utility classes the components use. The `@source`
 * resolves next to the bundle, so the consumer never writes a fragile path.
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
