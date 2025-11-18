import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
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

			test("Clamps an invalid currentStep", async() => {
				const wrapper = mount({ currentStep: -1, stepCount: 10 });

				expect(wrapper.vm.internalCurrentStep).toBe(1);

				await wrapper.setProps({ currentStep: 50 });

				expect(wrapper.vm.internalCurrentStep).toBe(10);
			});
		});

		describe("proportionalValue", () => {
			test("Reflects the current step", async() => {
				const wrapper = mount({ currentStep: 4, stepCount: 10 });

				expect(wrapper.vm.proportionalValue).toBe(0.4);

				await wrapper.setProps({ currentStep: 1, stepCount: 2 });

				expect(wrapper.vm.proportionalValue).toBe(0.5);
			});
		});

		describe("percentageValue", () => {
			test("Reflects the current step", async() => {
				const wrapper = mount({ currentStep: 4, stepCount: 10 });

				expect(wrapper.vm.percentageValue).toBe(40);

				await wrapper.setProps({ currentStep: 1, stepCount: 2 });

				expect(wrapper.vm.percentageValue).toBe(50);
			});
		});
	});
});
