import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import AccordionItem from "./accordion-panel.vue";

const registerPanelMock = vi.fn();
const provide = { "accordion-group": { registerPanel: registerPanelMock, showPanelLabel: "Show panel", hidePanelLabel: "Hide panel" } };
const mount = createMount(AccordionItem, { global: { provide } });

describe("accordion-panel", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("show", () => {
			test("should mark the panel as visible", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.isVisible = false;

				vm.show();

				expect(vm.isVisible).toBe(true);

				vm.show();

				expect(vm.isVisible).toBe(true);
			});
		});

		describe("hide", () => {
			test("should mark the panel as not visible", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.isVisible = true;

				vm.hide();

				expect(vm.isVisible).toBe(false);

				vm.hide();

				expect(vm.isVisible).toBe(false);
			});
		});

		describe("toggle", () => {
			test("should toggle the panel", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.isVisible = false;

				vm.toggle();

				expect(vm.isVisible).toBe(true);

				vm.toggle();

				expect(vm.isVisible).toBe(false);
			});
		});
	});
});
