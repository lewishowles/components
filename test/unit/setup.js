import { afterEach } from "vitest";
import { components } from "@/components";
import { config } from "@vue/test-utils";
import { cleanupMountedWrappers } from "./support/mount";

config.global.components = components;

// Clean up all mounted component instances after each test to prevent global
// listener pollution from @vueuse/core handlers (e.g., onKeyStroke).
afterEach(() => {
	cleanupMountedWrappers();
});
