import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import { ref } from "vue";
import AccordionGroup from "./accordion-group.vue";

const mount = createMount(AccordionGroup);

describe("accordion-group", () => {
	const show = vi.fn();
	const hide = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("areAllPanelsVisible", () => {
			test("should recognise when all panels are visible", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerPanel({ isVisible: ref(true), show, hide });
				vm.registerPanel({ isVisible: ref(true), show, hide });

				expect(vm.areAllPanelsVisible).toBe(true);
			});

			test("should recognise when not all panels are visible", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerPanel({ isVisible: ref(true), show, hide });
				vm.registerPanel({ isVisible: ref(false), show, hide });

				expect(vm.areAllPanelsVisible).toBe(false);
			});
		});
	});

	describe("Methods", () => {
		describe("registerPanels", () => {
			const isVisible = ref(false);

			describe("should not register a panel if `isVisible` is not a valid ref", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, isVisible]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(vm.panels).toEqual([]);

					vm.registerPanel({ isVisible, show, hide });

					expect(vm.panels).toEqual([]);
				});
			});

			describe("should not register a panel if `show` is not a valid method", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, show]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(vm.panels).toEqual([]);

					vm.registerPanel({ isVisible, show, hide });

					expect(vm.panels).toEqual([]);
				});
			});

			describe("should not register a panel if `hide` is not a valid method", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, hide]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(vm.panels).toEqual([]);

					vm.registerPanel({ isVisible, show, hide });

					expect(vm.panels).toEqual([]);
				});
			});

			test("should register a valid panel", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.panels).toEqual([]);

				vm.registerPanel({ isVisible, show, hide });

				expect(vm.panels).toHaveLength(1);
			});
		});
	});
});
