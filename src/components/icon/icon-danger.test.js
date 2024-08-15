import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconDanger from "./icon-danger.vue";

const mount = createMount(IconDanger);

describe("icon-danger", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});