import { afterEach, vi } from "vite-plus/test";
import { components } from "@/components";
import { config } from "@vue/test-utils";
import { cleanupMountedWrappers } from "./support/mount";

config.global.components = components;

// Provide a consistent localStorage mock.
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
	key: vi.fn(),
	length: 0,
};

vi.stubGlobal("localStorage", localStorageMock);

// Clean up all mounted component instances after each test to prevent global
// listener pollution from @vueuse/core handlers (e.g., onKeyStroke).
afterEach(() => {
	cleanupMountedWrappers();
});
