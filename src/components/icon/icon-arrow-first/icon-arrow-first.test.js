import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconArrowFirst from "./icon-arrow-first.vue";

const mount = createMount(IconArrowFirst);

describe("icon-arrow-first", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
