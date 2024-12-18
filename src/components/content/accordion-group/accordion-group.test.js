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
		describe("allOpen", () => {
			test("should recognise when all sections are visible", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerSection({ isVisible: ref(true), show, hide });
				vm.registerSection({ isVisible: ref(true), show, hide });

				expect(vm.allOpen).toBe(true);
			});

			test("should recognise when not all sections are visible", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerSection({ isVisible: ref(true), show, hide });
				vm.registerSection({ isVisible: ref(false), show, hide });

				expect(vm.allOpen).toBe(false);
			});
		});
	});

	describe("Methods", () => {
		describe("registerSection", () => {
			const isVisible = ref(false);

			describe("should not register a section if `isVisible` is not a valid ref", () => {
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

					expect(vm.sections).toEqual([]);

					vm.registerSection({ isVisible, show, hide });

					expect(vm.sections).toEqual([]);
				});
			});

			describe("should not register a section if `show` is not a valid method", () => {
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

					expect(vm.sections).toEqual([]);

					vm.registerSection({ isVisible, show, hide });

					expect(vm.sections).toEqual([]);
				});
			});

			describe("should not register a section if `hide` is not a valid method", () => {
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

					expect(vm.sections).toEqual([]);

					vm.registerSection({ isVisible, show, hide });

					expect(vm.sections).toEqual([]);
				});
			});

			test("should register a valid section", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.sections).toEqual([]);

				vm.registerSection({ isVisible, show, hide });

				expect(vm.sections).toHaveLength(1);
			});
		});
	});
});
