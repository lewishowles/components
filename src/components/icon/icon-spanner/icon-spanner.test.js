import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconSpanner from "./icon-spanner.vue";

const mount = createMount(IconSpanner);

describe("icon-spanner", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
