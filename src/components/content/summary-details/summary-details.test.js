import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import SummaryDetails from "./summary-details.vue";

const mount = createMount(SummaryDetails);

describe("summary-details", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("toggleDetails", () => {
			test("should open the details when closed", () => {
				const wrapper = mount();

				wrapper.vm.toggleDetails();

				expect(wrapper.vm.isOpen).toBe(true);
			});

			test("should close the details when open", () => {
				const wrapper = mount({ open: true });

				wrapper.vm.toggleDetails();

				expect(wrapper.vm.isOpen).toBe(false);
			});
		});
	});

	describe("Exposed", () => {
		test("should expose summaryElement as a DOM element", () => {
			const wrapper = mount();

			expect(wrapper.vm.summaryElement).toBeInstanceOf(Element);
		});

		test("should expose contentElement as a DOM element", () => {
			const wrapper = mount();

			expect(wrapper.vm.contentElement).toBeInstanceOf(Element);
		});
	});

	describe("Escape key", () => {
		test("should not call preventDefault when closed", () => {
			mount({ closeWithEscape: true });

			const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
			const preventDefaultSpy = vi.spyOn(event, "preventDefault");

			window.dispatchEvent(event);

			expect(preventDefaultSpy).not.toHaveBeenCalled();
		});
	});

	describe("Computed", () => {
		describe("contentRole", () => {
			test("should return 'status' when toggletip is true", () => {
				const wrapper = mount({ toggletip: true });

				expect(wrapper.vm.contentRole).toBe("status");
			});

			test("should return null when toggletip is false", () => {
				const wrapper = mount({ toggletip: false });

				expect(wrapper.vm.contentRole).toBeNull();
			});
		});

		describe("contentLive", () => {
			test("should return 'polite' when toggletip is true", () => {
				const wrapper = mount({ toggletip: true });

				expect(wrapper.vm.contentLive).toBe("polite");
			});

			test("should return null when toggletip is false", () => {
				const wrapper = mount({ toggletip: false });

				expect(wrapper.vm.contentLive).toBeNull();
			});
		});

		describe("currentIcon", () => {
			test("should show the appropriate default icons", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.currentIcon).toBe("icon-chevron-down");

				vm.isOpen = true;

				expect(vm.currentIcon).toBe("icon-chevron-up");
			});

			test("should allow default icons to be overridden", () => {
				const wrapper = mount({ iconClosed: "icon-arrow-right", iconOpen: "icon-arrow-left" });
				const vm = wrapper.vm;

				expect(vm.currentIcon).toBe("icon-arrow-right");

				vm.isOpen = true;

				expect(vm.currentIcon).toBe("icon-arrow-left");
			});

			test("should allow a single icon override", () => {
				const wrapper = mount({ icon: "icon-user" });
				const vm = wrapper.vm;

				expect(vm.currentIcon).toBe("icon-user");

				vm.isOpen = true;

				expect(vm.currentIcon).toBe("icon-user");
			});
		});
	});
});
