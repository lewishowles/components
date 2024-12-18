import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import { ref } from "vue";
import AccordionGroup from "./accordion-group.vue";

const mount = createMount(AccordionGroup);

describe("accordion-group", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("registerSection", () => {
			const open = vi.fn();
			const close = vi.fn();
			const isOpen = ref(false);

			describe("should not register a section if `isOpen` is not a valid ref", () => {
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
				])("%s", ([, isOpen]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(vm.sections).toEqual([]);

					vm.registerSection({ isOpen, open, close });

					expect(vm.sections).toEqual([]);
				});
			});

			describe("should not register a section if `open` is not a valid method", () => {
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
				])("%s", ([, open]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(vm.sections).toEqual([]);

					vm.registerSection({ isOpen, open, close });

					expect(vm.sections).toEqual([]);
				});
			});

			describe("should not register a section if `close` is not a valid method", () => {
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
				])("%s", ([, close]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(vm.sections).toEqual([]);

					vm.registerSection({ isOpen, open, close });

					expect(vm.sections).toEqual([]);
				});
			});

			test("should register a valid section", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.sections).toEqual([]);

				vm.registerSection({ isOpen, open, close });

				expect(vm.sections).toHaveLength(1);
			});
		});
	});
});
