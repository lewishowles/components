import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import SkeletonLoader from "./skeleton-loader.vue";

const mount = createMount(SkeletonLoader);

describe("skeleton-loader", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
