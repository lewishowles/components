import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import TabGroup from "./tab-group.vue";

const mount = createMount(TabGroup);

describe("tab-group", () => {
	const basicTab = { tabId: "id-123" };
	const secondaryTab = { tabId: "id-456" };

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("registerTab", () => {
			test("should register a new tab", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerTab(basicTab);

				expect(vm.tabs).toEqual([basicTab]);
			});

			test("should ensure a tab is marked as active", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerTab(basicTab);

				expect(vm.activeTabId).toBe(basicTab.tabId);
			});

			test("should recognise initiallyActive", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerTab(basicTab);
				vm.registerTab({ ...secondaryTab, initiallyActive: true });

				expect(vm.activeTabId).toBe(secondaryTab.tabId);
			});
		});

		describe("ensureActiveTab", () => {
			test("should mark the first tab as active", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.tabs = [basicTab];

				vm.ensureActiveTab();

				expect(vm.activeTabId).toBe(basicTab.tabId);
			});

			test("should not override an existing active tab", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.tabs = [basicTab, secondaryTab];

				vm.activeTabId = "id-456";

				vm.ensureActiveTab();

				expect(vm.activeTabId).toBe("id-456");
			});

			test("should override a tab ID that does not exist in the current tabs", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.activeTabId = "sample-id";
				vm.tabs = [basicTab, secondaryTab];

				vm.ensureActiveTab();

				expect(vm.activeTabId).toBe("id-123");
			});
		});

		describe("setActiveTabByIndex", () => {
			test("should allow an active tab to be set", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.tabs = [basicTab, secondaryTab];

				vm.setActiveTabByIndex(1);

				expect(vm.activeTabId).toBe(secondaryTab.tabId);
			});

			test("should clamp an invalid index", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.tabs = [basicTab, secondaryTab];

				vm.setActiveTabByIndex(-1);

				expect(vm.activeTabId).toBe(basicTab.tabId);

				vm.setActiveTabByIndex(10);

				expect(vm.activeTabId).toBe(secondaryTab.tabId);
			});
		});

		describe("setActiveTab", () => {
			test("should allow an active tab to be set", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.tabs = [basicTab, secondaryTab];

				vm.setActiveTab(basicTab.tabId);

				expect(vm.activeTabId).toBe(basicTab.tabId);
			});

			test("should ignore an invalid tab ID", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.tabs = [basicTab, secondaryTab];

				vm.setActiveTab("invlaid-id");

				expect(vm.activeTabId).toBe(null);
			});
		});

		describe("isValidTabId", () => {
			test("should recognise a valid tab ID", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.tabs = [basicTab, secondaryTab];

				expect(vm.isValidTabId(basicTab.tabId)).toBe(true);
			});

			test("should reject an invalid tab ID", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.tabs = [basicTab, secondaryTab];

				expect(vm.isValidTabId("invalid-id")).toBe(false);
			});

			describe("should reject anything but a non-empty string", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					vm.tabs = [basicTab, secondaryTab];

					expect(vm.isValidTabId(input)).toBe(false);
				});
			});

			describe("isActiveTab", () => {
				test("should detect the currently active tab", () => {
					const wrapper = mount();
					const vm = wrapper.vm;

					vm.tabs = [basicTab, secondaryTab];

					vm.activeTabId = basicTab.tabId;

					expect(vm.isActiveTab(basicTab.tabId)).toBe(true);
					expect(vm.isActiveTab(secondaryTab.tabId)).toBe(false);
				});
			});
		});
	});
});
