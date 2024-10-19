import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconWarning from "./icon-warning.vue";

const mount = createMount(IconWarning);

describe("icon-warning", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
