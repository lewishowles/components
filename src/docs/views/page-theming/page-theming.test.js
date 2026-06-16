import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";

import PageTheming from "./page-theming.vue";

const mount = createMount(PageTheming);

describe("page-theming", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
