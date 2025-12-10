import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconStar from "./icon-star.vue";

const mount = createMount(IconStar);

describe("icon-star", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
