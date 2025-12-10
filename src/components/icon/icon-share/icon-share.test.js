import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconShare from "./icon-share.vue";

const mount = createMount(IconShare);

describe("icon-share", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
