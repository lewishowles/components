import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import LoadingSkeleton from "./loading-skeleton.vue";

const mount = createMount(LoadingSkeleton);

describe("loading-skeleton", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
