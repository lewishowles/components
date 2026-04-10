import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconWave from "./icon-wave.vue";

const mount = createMount(IconWave);

describe("icon-wave", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
