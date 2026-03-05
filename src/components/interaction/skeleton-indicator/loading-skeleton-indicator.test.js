import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import SkeletonIndicator from "./loading-skeleton-indicator.vue";

const mount = createMount(SkeletonIndicator);

describe("loading-skeleton-indicator", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
