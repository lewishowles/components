import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ProgressBar from "./progress-bar.vue";

const mount = createMount(ProgressBar);

describe("progress-bar", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalValue", () => {
			test("should reflect a valid value", () => {
				const wrapper = mount({ value: 10 });

				expect(wrapper.vm.internalValue).toBe(10);
			});

			test("should clamp an invalid value", () => {
				const wrapper = mount({ value: -1 });

				expect(wrapper.vm.internalValue).toBe(0);
			});
		});

		describe("proportionalValue", () => {
			test("should reflect the current value", async() => {
				const wrapper = mount({ value: 40 });

				expect(wrapper.vm.proportionalValue).toBe(0.4);

				await wrapper.setProps({ min: 40, max: 80, value: 50 });

				expect(wrapper.vm.proportionalValue).toBe(0.125);
			});
		});

		describe("percentageValue", () => {
			test("should reflect the current value", async() => {
				const wrapper = mount({ value: 40 });

				expect(wrapper.vm.percentageValue).toBe(40);

				await wrapper.setProps({ min: 40, max: 80, value: 50 });

				expect(wrapper.vm.percentageValue).toBe(12.5);
			});
		});
	});
});
