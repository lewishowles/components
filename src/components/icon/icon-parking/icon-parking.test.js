import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconParking from "./icon-parking.vue";

const mount = createMount(IconParking);

describe("icon-parking", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
