import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import LoadingIndicator from "./loading-indicator.vue";

const mount = createMount(LoadingIndicator);

describe("loading-indicator", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
