import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";

import ContentCardColumns from "./content-card-columns.vue";

const mount = createMount(ContentCardColumns, { slots: { default: "Columns content" } });

describe("content-card-columns", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
