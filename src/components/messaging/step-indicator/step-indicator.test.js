import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import StepIndicator from "./step-indicator.vue";

const mount = createMount(StepIndicator);

describe("step-indicator", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount({ currentStep: 1, stepCount: 5 });

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalCurrentStep", () => {
			test("Reflects a valid currentStep", () => {
				const wrapper = mount({ currentStep: 10, stepCount: 10 });

				expect(wrapper.vm.internalCurrentStep).toBe(10);
			});

			test("Clamps an invalid currentStep", async () => {
				const wrapper = mount({ currentStep: -1, stepCount: 10 });

				expect(wrapper.vm.internalCurrentStep).toBe(1);

				await wrapper.setProps({ currentStep: 50 });

				expect(wrapper.vm.internalCurrentStep).toBe(10);
			});
		});

		describe("proportionalValue", () => {
			test("Reflects the current step", async () => {
				const wrapper = mount({ currentStep: 4, stepCount: 10 });

				expect(wrapper.vm.proportionalValue).toBe(0.4);

				await wrapper.setProps({ currentStep: 1, stepCount: 2 });

				expect(wrapper.vm.proportionalValue).toBe(0.5);
			});
		});

		describe("percentageValue", () => {
			test("Reflects the current step", async () => {
				const wrapper = mount({ currentStep: 4, stepCount: 10 });

				expect(wrapper.vm.percentageValue).toBe(40);

				await wrapper.setProps({ currentStep: 1, stepCount: 2 });

				expect(wrapper.vm.percentageValue).toBe(50);
			});
		});

		describe("segments", () => {
			test("Marks completed steps", async () => {
				const wrapper = mount({ currentStep: 2, stepCount: 5 });

				expect(wrapper.vm.segments).toEqual([
					{ step: 1, complete: true },
					{ step: 2, complete: true },
					{ step: 3, complete: false },
					{ step: 4, complete: false },
					{ step: 5, complete: false },
				]);

				await wrapper.setProps({ currentStep: 5 });

				expect(wrapper.vm.segments).toEqual([
					{ step: 1, complete: true },
					{ step: 2, complete: true },
					{ step: 3, complete: true },
					{ step: 4, complete: true },
					{ step: 5, complete: true },
				]);
			});
		});
	});
});
