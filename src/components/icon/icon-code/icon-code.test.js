import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconCode from "./icon-code.vue";

const mount = createMount(IconCode);

describe("icon-code", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
