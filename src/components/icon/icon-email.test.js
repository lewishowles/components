import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconEmail from "./icon-email.vue";

const mount = createMount(IconEmail);

describe("icon-email", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
