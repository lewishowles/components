import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconPadlock from "./icon-padlock.vue";

const mount = createMount(IconPadlock);

describe("icon-padlock", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
