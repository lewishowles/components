import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconClipboard from "./icon-clipboard.vue";

const mount = createMount(IconClipboard);

describe("icon-clipboard", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
