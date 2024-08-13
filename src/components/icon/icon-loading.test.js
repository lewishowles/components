import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconLoading from "./icon-loading.vue";

const mount = createMount(IconLoading);

describe("icon-loading", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
