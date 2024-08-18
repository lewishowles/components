import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconLaptop from "./icon-laptop.vue";

const mount = createMount(IconLaptop);

describe("icon-laptop", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
