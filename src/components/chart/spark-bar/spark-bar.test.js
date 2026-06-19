import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import SparkBar from "./spark-bar.vue";

const mount = createMount(SparkBar);

describe("spark-bar", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalValue", () => {
			test("should reflect a valid value", () => {
				const wrapper = mount({ current: 10 });

				expect(wrapper.vm.internalValue).toBe(10);
			});

			test("should clamp an invalid value", () => {
				const wrapper = mount({ current: -1 });

				expect(wrapper.vm.internalValue).toBe(0);
			});

			test("should clamp a value above maximum", () => {
				const wrapper = mount({ current: 150, max: 100 });

				expect(wrapper.vm.internalValue).toBe(100);
			});
		});

		describe("percentageValue", () => {
			test("should calculate percentage for default range", () => {
				const wrapper = mount({ current: 40 });

				expect(wrapper.vm.percentageValue).toBe(40);
			});

			test("should calculate percentage for custom range", () => {
				const wrapper = mount({ min: 40, max: 80, current: 50 });

				expect(wrapper.vm.percentageValue).toBe(25);
			});

			test("should return 0 when max <= min", () => {
				const wrapper = mount({ min: 100, max: 100, current: 50 });

				expect(wrapper.vm.percentageValue).toBe(0);
			});

			test("should round percentage to whole number", () => {
				const wrapper = mount({ min: 0, max: 3, current: 1 });

				expect(wrapper.vm.percentageValue).toBe(33);
			});
		});
	});
});
