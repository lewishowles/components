import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconInfo from "./icon-info.vue";

const mount = createMount(IconInfo);

describe("icon-info", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
