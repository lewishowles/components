import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { alias } from "./support/aliases.js";
import { createComponentSource, createNamedExports } from "./support/plugins/index.js";
import fmt from "./support/oxfmt.config.js";
import lint from "./support/oxlint.config.js";

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	fmt,
	lint,
	plugins: [vue(), vueDevTools(), tailwindcss(), createComponentSource(), createNamedExports()],
	resolve: {
		alias,
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
