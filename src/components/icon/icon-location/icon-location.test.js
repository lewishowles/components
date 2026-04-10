import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconLocation from "./icon-location.vue";

const mount = createMount(IconLocation);

describe("icon-location", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
