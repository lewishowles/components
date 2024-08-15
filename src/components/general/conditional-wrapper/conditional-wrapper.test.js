import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ConditionalWrapper from "./conditional-wrapper.vue";

const mount = createMount(ConditionalWrapper);

describe("conditional-wrapper", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
