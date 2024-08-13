import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			setupFiles: "./test/unit/setup.js",
			environment: "jsdom",
			root: fileURLToPath(new URL("./", import.meta.url)),
			include: ["**/*.test.js"],
		},
	}),
);
