import { defineConfig } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { alias } from "./aliases.js";
import { publishStylesheets } from "./plugins/index.js";

export default defineConfig({
	plugins: [vue(), tailwindcss(), publishStylesheets()],
	resolve: {
		alias,
	},
	build: {
		outDir: "dist-docs",
	},
});
