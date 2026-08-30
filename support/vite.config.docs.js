import { defineConfig } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import dynamicImportVariables from "@rollup/plugin-dynamic-import-vars";
import { alias } from "./aliases.js";
import { createNamedExports, prepareDocsForPages, publishStylesheets } from "./plugins/index.js";

export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
		// MicroLighter loads grammars via a dynamic import inside its own package code;
		// Vite/Rolldown don't bundle dependency-internal dynamic imports by default,
		// so without this the grammar files are silently missing from the built docs site.
		dynamicImportVariables({
			include: "**/node_modules/microlighter/**/*.js",
		}),
		createNamedExports(),
		publishStylesheets(),
		prepareDocsForPages(),
	],
	resolve: {
		alias,
	},
	build: {
		outDir: "dist-docs",
	},
});
