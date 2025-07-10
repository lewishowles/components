import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@cypress": fileURLToPath(new URL("./test/cypress", import.meta.url)),
			"@unit": fileURLToPath(new URL("./test/unit", import.meta.url)),
		},
	},
	build: {
		outDir: "dist-docs",
	},
});
