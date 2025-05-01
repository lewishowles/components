import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconSlot from "./icon-slot.vue";

const mount = createMount(IconSlot);

describe("icon-slot", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
