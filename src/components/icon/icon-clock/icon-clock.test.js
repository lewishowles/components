import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconClock from "./icon-clock.vue";

const mount = createMount(IconClock);

describe("icon-clock", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
