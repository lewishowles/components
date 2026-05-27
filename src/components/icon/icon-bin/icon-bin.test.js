import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import IconBin from "./icon-bin.vue";

const mount = createMount(IconBin);

describe("icon-bin", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
