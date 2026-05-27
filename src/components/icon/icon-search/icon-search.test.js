import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import IconSearch from "./icon-search.vue";

const mount = createMount(IconSearch);

describe("icon-search", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
