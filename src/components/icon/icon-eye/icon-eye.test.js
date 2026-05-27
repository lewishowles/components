import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import IconEye from "./icon-eye.vue";

const mount = createMount(IconEye);

describe("icon-eye", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
