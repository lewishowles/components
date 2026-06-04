import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import fmt from "./oxfmt.config.js";
import lint from "./oxlint.config.js";

/**
 * Create a stylesheet that registers the built components as a Tailwind source.
 * Consumers import it once — `@import "@lewishowles/components/source"` — and
 * Tailwind generates the utility classes the components use. The `@source`
 * resolves next to the bundle, so the consumer never writes a fragile path.
 */
function createComponentSource() {
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

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	fmt,
	lint,
	plugins: [vue(), vueDevTools(), tailwindcss(), createComponentSource()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@cypress": fileURLToPath(new URL("./test/cypress", import.meta.url)),
			"@unit": fileURLToPath(new URL("./test/unit", import.meta.url)),
		},
	},
	build: {
		lib: {
			entry: {
				components: fileURLToPath(new URL("./src/index.js", import.meta.url)),
				composables: fileURLToPath(new URL("./src/composables/index.js", import.meta.url)),
				utilities: fileURLToPath(new URL("./src/utilities/index.js", import.meta.url)),
			},
			formats: ["es"],
		},
		rollupOptions: {
			external: ["vue"],
			output: {
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});
