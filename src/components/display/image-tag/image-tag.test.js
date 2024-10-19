import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ImageTag from "./image-tag.vue";

const mount = createMount(ImageTag);

describe("image-tag", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
