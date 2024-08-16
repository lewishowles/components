import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconArrowLeft from "./icon-arrow-left.vue";

const mount = createMount(IconArrowLeft);

describe("icon-arrow-left", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
