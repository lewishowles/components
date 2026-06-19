import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
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
		describe("isIndeterminate", () => {
			test("should be false when current is a number", () => {
				const wrapper = mount({ current: 50 });

				expect(wrapper.vm.isIndeterminate).toBe(false);
			});

			test("should be true when current is null", () => {
				const wrapper = mount({ current: null });

				expect(wrapper.vm.isIndeterminate).toBe(true);
			});
		});

		describe("internalValue", () => {
			test("should reflect a valid value", () => {
				const wrapper = mount({ current: 10 });

				expect(wrapper.vm.internalValue).toBe(10);
			});

			test("should clamp an invalid value", () => {
				const wrapper = mount({ current: -1 });

				expect(wrapper.vm.internalValue).toBe(0);
			});

			test("should return null when indeterminate", () => {
				const wrapper = mount({ current: null });

				expect(wrapper.vm.internalValue).toBeNull();
			});
		});

		describe("percentageValue", () => {
			test("should calculate percentage for default range", () => {
				const wrapper = mount({ current: 40 });

				expect(wrapper.vm.percentageValue).toBe(40);
			});

			test("should calculate percentage for custom range", async () => {
				const wrapper = mount({ min: 40, max: 80, current: 50 });

				expect(wrapper.vm.percentageValue).toBe(25);
			});

			test("should return 0 when max <= min", () => {
				const wrapper = mount({ min: 100, max: 100, current: 50 });

				expect(wrapper.vm.percentageValue).toBe(0);
			});

			test("should return 0 when indeterminate", () => {
				const wrapper = mount({ current: null });

				expect(wrapper.vm.percentageValue).toBe(0);
			});
		});

		describe("variantRole", () => {
			test("should return progressbar for the progress variant", () => {
				const wrapper = mount({ variant: "progress" });

				expect(wrapper.vm.variantRole).toBe("progressbar");
			});

			test("should return meter for the meter variant", () => {
				const wrapper = mount({ variant: "meter" });

				expect(wrapper.vm.variantRole).toBe("meter");
			});
		});

		describe("valueText", () => {
			test("should return a percentage string by default", () => {
				const wrapper = mount({ current: 40 });

				expect(wrapper.vm.valueText).toBe("40%");
			});

			test("should use getValueLabel when provided", () => {
				const wrapper = mount({
					current: 3,
					max: 10,
					getValueLabel: (value) => `${value} of 10 files uploaded`,
				});

				expect(wrapper.vm.valueText).toBe("3 of 10 files uploaded");
			});
		});

		describe("internalId", () => {
			test("should be stable across re-renders", async () => {
				const wrapper = mount({ current: 25 });
				const id = wrapper.vm.internalId;

				await wrapper.setProps({ current: 75 });

				expect(wrapper.vm.internalId).toBe(id);
			});
		});
	});
});
