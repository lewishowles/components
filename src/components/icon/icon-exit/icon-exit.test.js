import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconExit from "./icon-exit.vue";

const mount = createMount(IconExit);

describe("icon-exit", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
