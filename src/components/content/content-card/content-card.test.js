import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";

import ContentCard from "./content-card.vue";

const mount = createMount(ContentCard);

describe("content-card", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
