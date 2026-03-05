import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import LoadingSpinner from "./loading-spinner.vue";

const mount = createMount(LoadingSpinner);

describe("loading-spinner", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
