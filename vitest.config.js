import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vite-plus";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			setupFiles: "./test/unit/setup.js",
			environment: "happy-dom",
			environmentMatchGlobs: [
				["bin/**", "node"],
				["src/cli/**", "node"],
			],
			root: fileURLToPath(new URL("./", import.meta.url)),
			include: ["bin/**/*.test.js", "src/**/*.test.js", "support/**/*.test.js"],
		},
	}),
);
