import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconObject from "./icon-object.vue";

const mount = createMount(IconObject);

describe("icon-object", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
