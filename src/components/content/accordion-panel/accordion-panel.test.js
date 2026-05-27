import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vite-plus/test";
import { ref } from "vue";
import AccordionItem from "./accordion-panel.vue";

const registerPanelMock = vi.fn();

const defaultProvide = {
	"accordion-group": {
		headingLevel: "h2",
		hidePanelLabel: "Hide panel",
		panelCount: ref(3),
		registerPanel: registerPanelMock,
		showPanelLabel: "Show panel",
	},
};

const mount = createMount(AccordionItem, { global: { provide: defaultProvide } });

describe("accordion-panel", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("useRegion", () => {
			test("should be true when the panel count is 6 or fewer", () => {
				const mountWithCount = createMount(AccordionItem, {
					global: {
						provide: {
							"accordion-group": { ...defaultProvide["accordion-group"], panelCount: ref(6) },
						},
					},
				});

				const wrapper = mountWithCount();

				expect(wrapper.vm.useRegion).toBe(true);
			});

			test("should be false when the panel count exceeds 6", () => {
				const mountWithCount = createMount(AccordionItem, {
					global: {
						provide: {
							"accordion-group": { ...defaultProvide["accordion-group"], panelCount: ref(7) },
						},
					},
				});

				const wrapper = mountWithCount();

				expect(wrapper.vm.useRegion).toBe(false);
			});
		});
	});

	describe("Slots", () => {
		describe("show-panel-label", () => {
			test("Exposes isOpen and toggle slot props", () => {
				let receivedProps = null;

				mount({
					slots: {
						"show-panel-label": (slotProps) => {
							receivedProps = slotProps;

							return "label";
						},
					},
				});

				expect(receivedProps).toMatchObject({
					isOpen: false,
					toggle: expect.any(Function),
				});
			});
		});

		describe("default", () => {
			test("Exposes isOpen slot prop", () => {
				let receivedProps = null;

				mount({
					slots: {
						default: (slotProps) => {
							receivedProps = slotProps;

							return "content";
						},
					},
				});

				expect(receivedProps).toMatchObject({
					isOpen: false,
				});
			});
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
