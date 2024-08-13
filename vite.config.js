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
		lib: {
			entry: fileURLToPath(new URL("./src/index.js", import.meta.url)),
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
