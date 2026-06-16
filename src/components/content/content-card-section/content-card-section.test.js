import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";

import ContentCardSection from "./content-card-section.vue";

const mount = createMount(ContentCardSection, { slots: { default: "Section content" } });

describe("content-card-section", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
