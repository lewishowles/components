import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import ContentSeparator from "./content-separator.vue";

const mount = createMount(ContentSeparator);

describe("content-separator", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("isHorizontal", () => {
			test("Is true by default", () => {
				const wrapper = mount();

				expect(wrapper.vm.isHorizontal).toBe(true);
			});

			test("Is false when orientation is vertical", () => {
				const wrapper = mount({ orientation: "vertical" });

				expect(wrapper.vm.isHorizontal).toBe(false);
			});
		});

		describe("isVertical", () => {
			test("Is false by default", () => {
				const wrapper = mount();

				expect(wrapper.vm.isVertical).toBe(false);
			});

			test("Is true when orientation is vertical", () => {
				const wrapper = mount({ orientation: "vertical" });

				expect(wrapper.vm.isVertical).toBe(true);
			});
		});

		describe("isSemantic", () => {
			test("Is false for the default div tag", () => {
				const wrapper = mount();

				expect(wrapper.vm.isSemantic).toBe(false);
			});

			test("Is true when tag is hr", () => {
				const wrapper = mount({ tag: "hr" });

				expect(wrapper.vm.isSemantic).toBe(true);
			});
		});

		describe("explicitOrientation", () => {
			test("Is undefined for a decorative div", () => {
				const wrapper = mount();

				expect(wrapper.vm.explicitOrientation).toBeUndefined();
			});

			test("Is the orientation for a semantic hr", () => {
				const wrapper = mount({ tag: "hr" });

				expect(wrapper.vm.explicitOrientation).toBe("horizontal");
			});

			test("Is vertical when orientation is vertical and tag is hr", () => {
				const wrapper = mount({ tag: "hr", orientation: "vertical" });

				expect(wrapper.vm.explicitOrientation).toBe("vertical");
			});
		});
	});
});
