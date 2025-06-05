import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconPencil from "./icon-pencil.vue";

const mount = createMount(IconPencil);

describe("icon-pencil", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
