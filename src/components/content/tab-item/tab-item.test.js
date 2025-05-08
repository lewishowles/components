import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import { ref } from "vue";
import TabItem from "./tab-item.vue";

const registerTabMock = vi.fn();
const provide = { "tab-group": { registerTab: registerTabMock, activeTabId: ref("id-123") } };
const mount = createMount(TabItem, { global: { provide } });

describe("tab-item", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("should register itself", () => {
			mount();

			expect(registerTabMock).toHaveBeenCalled();
		});

		test("should allow an ID to be provided", () => {
			const wrapper = mount({ id: "tab-playground" });
			const vm = wrapper.vm;

			expect(vm.id).toBe("tab-playground");
		});
	});
});
