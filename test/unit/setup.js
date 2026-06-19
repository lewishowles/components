import { afterEach } from "vite-plus/test";
import { cleanupMountedWrappers } from "@lewishowles/testing/vue";
import { mockLocalStorage } from "@lewishowles/testing/vitest";

mockLocalStorage();

afterEach(() => {
	cleanupMountedWrappers();
});
