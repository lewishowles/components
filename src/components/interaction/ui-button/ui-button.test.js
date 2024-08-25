import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import UiButton from "./ui-button.vue";

const mount = createMount(UiButton);

describe("ui-button", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("computedIconClasses", () => {
			test("should return undefined without an icon", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toBe(undefined);
			});

			test("should return base classes if no icon classes are defined", () => {
				const wrapper = mount({ iconStart: "icon-arrow-left" });
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toEqual(["stroke-current", "size-[0.857em]"]);
			});

			test("should return base classes combined with provided classes if no size is defined", () => {
				const wrapper = mount({ iconStart: "icon-arrow-left", iconClasses: "rounded-full" });
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toEqual(["rounded-full", "stroke-current", "size-[0.857em]"]);
			});

			test("should return the correct combined classes if a size is defined", () => {
				const wrapper = mount({ iconStart: "icon-arrow-left", iconClasses: "size-4" });
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toEqual(["size-4", "stroke-current"]);
			});

			test("should return the correct combined classes if a stroke is defined", () => {
				const wrapper = mount({ iconStart: "icon-arrow-left", iconClasses: "stroke-purple-600" });
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toEqual(["stroke-purple-600", "size-[0.857em]"]);
			});
		});
	});

	describe("Methods", () => {
		describe("reset", () => {
			test("should reset reactive state", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.isReacting = true;

				vm.reset();

				expect(vm.isReacting).toBe(false);
			});
		});
	});
});
