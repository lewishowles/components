import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import BaseIcon from "./base-icon.vue";

const mount = createMount(BaseIcon);

describe("base-icon", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
