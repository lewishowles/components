import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconGithub from "./icon-github.vue";

const mount = createMount(IconGithub);

describe("icon-github", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
