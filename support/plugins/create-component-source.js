/**
 * Create stylesheets that register the built components as a Tailwind source.
 * `source.css` is kept for compatibility; `styles.css` also imports the
 * component CSS extracted from SFC `<style>` blocks.
 */
export function createComponentSource() {
	return {
		name: "create-component-source",

		generateBundle() {
			const source = `@source "./components.js";\n`;

			this.emitFile({
				type: "asset",
				fileName: "source.css",
				source,
			});

			this.emitFile({
				type: "asset",
				fileName: "styles.css",
				source: `@import "./components.css";\n${source}`,
			});
		},
	};
}
