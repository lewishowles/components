import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import FloatingDetails from "./floating-details.vue";

const mount = createMount(FloatingDetails);

describe("floating-details", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
