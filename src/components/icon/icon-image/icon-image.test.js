import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconImage from "./icon-image.vue";

const mount = createMount(IconImage);

describe("icon-image", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
