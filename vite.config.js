import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import vueDevTools from "vite-plugin-vue-devtools";
import { alias } from "./support/aliases.js";
import {
	createComponentSource,
	createNamedExports,
	internalComponentsResolver,
} from "./support/plugins/index.js";
import fmt from "./support/oxfmt.config.js";
import lint from "./support/oxlint.config.js";

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	fmt,
	lint,
	plugins: [
		vue(),
		// Resolve the library's own child-component tags to static imports at
		// build time. `dirs: []` disables the default filesystem scan so the
		// manifest-driven resolver is the only source of truth.
		Components({ dirs: [], dts: false, resolvers: [internalComponentsResolver()] }),
		vueDevTools(),
		tailwindcss(),
		createComponentSource(),
		createNamedExports(),
	],
	resolve: {
		alias,
	},
	build: {
		lib: {
			entry: {
				components: fileURLToPath(new URL("./src/index.js", import.meta.url)),
				composables: fileURLToPath(new URL("./src/composables/index.js", import.meta.url)),
				utilities: fileURLToPath(new URL("./src/utilities/index.js", import.meta.url)),
				resolver: fileURLToPath(new URL("./src/resolver.js", import.meta.url)),
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
