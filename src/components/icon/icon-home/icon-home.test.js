import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconHome from "./icon-home.vue";

const mount = createMount(IconHome);

describe("icon-home", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
