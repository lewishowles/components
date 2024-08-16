import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconUser from "./icon-user.vue";

const mount = createMount(IconUser);

describe("icon-user", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
