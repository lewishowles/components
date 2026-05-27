import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import IconReload from "./icon-reload.vue";

const mount = createMount(IconReload);

describe("icon-reload", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
