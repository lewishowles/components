import { alias } from "./support/aliases.js";
import { componentAutoImports } from "./support/plugins/component-auto-imports.js";
import { defineConfig, lazyPlugins } from "vite-plus";
import { URL, fileURLToPath } from "node:url";
import fmt from "./.oxfmtrc.json" with { type: "json" };
import lintConfigBase from "@lewishowles/lint-config/base.json" with { type: "json" };
import lintConfigVue from "@lewishowles/lint-config/vue.json" with { type: "json" };
import oxlintrc from "./.oxlintrc.json" with { type: "json" };
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

import {
	createComponentSource,
	createNamedExports,
	publishDeclarations,
	publishStylesheets,
} from "./support/plugins/index.js";

// vite-plus requires `extends` entries to be resolved objects rather than the string
// paths `.oxlintrc.json` uses for raw oxlint/editor consumption.
const lint = {
	...lintConfigVue,
	extends: [lintConfigBase],
	env: oxlintrc.env,
	globals: oxlintrc.globals,
	ignorePatterns: oxlintrc.ignorePatterns,
	overrides: oxlintrc.overrides,
	options: oxlintrc.options,
};

export default defineConfig({
	staged: {
		"*": "vp check --fix",
		"src/{composables,utilities}/**/*.js": "bun run check:declarations",
	},
	fmt,
	lint,
	plugins: lazyPlugins(() => [
		vue(),
		componentAutoImports(),
		tailwindcss(),
		createComponentSource(),
		createNamedExports(),
		publishDeclarations(),
		publishStylesheets(),
		vueDevTools(),
	]),
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
