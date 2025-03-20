import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconBell from "./icon-bell.vue";

const mount = createMount(IconBell);

describe("icon-bell", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
