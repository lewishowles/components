import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ContentDivider from "./content-divider.vue";

const mount = createMount(ContentDivider);

describe("content-divider", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
