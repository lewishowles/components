import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconMap from "./icon-map.vue";

const mount = createMount(IconMap);

describe("icon-map", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
