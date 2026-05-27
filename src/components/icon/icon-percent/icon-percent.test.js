import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import IconPercent from "./icon-percent.vue";

const mount = createMount(IconPercent);

describe("icon-percent", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
