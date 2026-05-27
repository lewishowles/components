import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import IconArrowUp from "./icon-arrow-up.vue";

const mount = createMount(IconArrowUp);

describe("icon-arrow-up", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
