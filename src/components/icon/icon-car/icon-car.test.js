import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconCar from "./icon-car.vue";

const mount = createMount(IconCar);

describe("icon-car", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
