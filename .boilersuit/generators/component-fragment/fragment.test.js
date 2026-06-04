import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import {{ NAME | pascal }} from "./{{ NAME | kebab }}.vue";

const mount = createMount({{ NAME | pascal }});

describe("{{ NAME | kebab }}", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
