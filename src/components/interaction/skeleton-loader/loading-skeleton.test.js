import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import LoadingSkeleton from "./loading-skeleton.vue";

const mount = createMount(LoadingSkeleton);

describe("loading-skeleton", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Validation", () => {
		test("shows an error if no label slot is provided", () => {
			const wrapper = mount();

			expect(wrapper.find("[data-test='loading-skeleton-no-label']").exists()).toBe(true);
		});

		test("does not show an error if a label slot is provided", () => {
			const wrapper = mount({ slots: { label: "Loading user data" } });

			expect(wrapper.find("[data-test='loading-skeleton-no-label']").exists()).toBe(false);
		});
	});
});
