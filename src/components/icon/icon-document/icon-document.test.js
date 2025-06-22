import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconDocument from "./icon-document.vue";

const mount = createMount(IconDocument);

describe("icon-document", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
