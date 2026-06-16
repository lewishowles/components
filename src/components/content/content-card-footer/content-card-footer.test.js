import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";

import ContentCardFooter from "./content-card-footer.vue";

const mount = createMount(ContentCardFooter, { slots: { default: "Footer content" } });

describe("content-card-footer", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
