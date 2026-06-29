import { alias } from "./support/aliases.js";
import { componentAutoImports } from "./support/plugins/component-auto-imports.js";
import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";
import fmt from "./.oxfmtrc.json" with { type: "json" };
import lint from "./.oxlintrc.json" with { type: "json" };
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

import {
	createComponentSource,
	createNamedExports,
	publishDeclarations,
	publishStylesheets,
} from "./support/plugins/index.js";

export default defineConfig({
	staged: {
		"*": "bun run lint:fix",
		"src/{composables,utilities}/**/*.js": "bun run check:declarations",
	},
	fmt,
	lint,
	plugins: [
		vue(),
		componentAutoImports(),
		tailwindcss(),
		createComponentSource(),
		createNamedExports(),
		publishDeclarations(),
		publishStylesheets(),
		vueDevTools(),
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
			cssFileName: "components",
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
