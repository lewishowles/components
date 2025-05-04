import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import CopyContent from "./copy-content.vue";

const mount = createMount(CopyContent);

describe("copy-content", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
