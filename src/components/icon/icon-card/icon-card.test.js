import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconCard from "./icon-card.vue";

const mount = createMount(IconCard);

describe("icon-card", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
