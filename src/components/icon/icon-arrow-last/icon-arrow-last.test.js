import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import IconArrowLast from "./icon-arrow-last.vue";

const mount = createMount(IconArrowLast);

describe("icon-arrow-last", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
