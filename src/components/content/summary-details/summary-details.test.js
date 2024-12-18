import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import SummaryDetails from "./summary-details.vue";

const mount = createMount(SummaryDetails);

describe("summary-details", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
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
