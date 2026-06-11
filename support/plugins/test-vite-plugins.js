import { componentAutoImports } from "./component-auto-imports.js";
import { createNamedExports } from "./index.js";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export function testVitePlugins() {
	return [vue(), componentAutoImports(), tailwindcss(), createNamedExports()];
}
