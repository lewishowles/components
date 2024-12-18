import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import AccordionItem from "./accordion-section.vue";

const registerSectionMock = vi.fn();
const provide = { "accordion-group": { registerSection: registerSectionMock } };
const mount = createMount(AccordionItem, { global: { provide } });

describe("accordion-section", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("open", () => {
			test("should mark the section as open", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.isOpen = false;

				vm.open();

				expect(vm.isOpen).toBe(true);

				vm.open();

				expect(vm.isOpen).toBe(true);
			});
		});

		describe("close", () => {
			test("should mark the section as closed", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.isOpen = true;

				vm.close();

				expect(vm.isOpen).toBe(false);

				vm.close();

				expect(vm.isOpen).toBe(false);
			});
		});

		describe("toggle", () => {
			test("should toggle the section", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.isOpen = false;

				vm.toggle();

				expect(vm.isOpen).toBe(true);

				vm.toggle();

				expect(vm.isOpen).toBe(false);
			});
		});
	});
});
