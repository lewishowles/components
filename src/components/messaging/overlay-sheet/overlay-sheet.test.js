import { createDeepMount } from "@lewishowles/testing/vue";
import { nextTick } from "vue";
import { describe, expect, test, vi } from "vite-plus/test";

import OverlaySheet from "./overlay-sheet.vue";

const mount = createDeepMount(OverlaySheet, {
	props: { isOpen: false, isSheet: false, label: "Details" },
	slots: { default: '<div data-test="content">Content</div>' },
});

describe("overlay-sheet", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("renders the default slot in place when wide", () => {
			const wrapper = mount();

			expect(wrapper.find('[data-test="content"]').element.parentElement).not.toBe(
				wrapper.find("dialog").element,
			);
		});

		test("renders the default slot in the dialog when initially narrow", async () => {
			const wrapper = mount({ props: { isSheet: true } });

			await waitForDialogUpdate();

			expect(wrapper.find('[data-test="content"]').element.parentElement).toBe(
				wrapper.find("dialog").element,
			);
		});

		test("does not expose imperative open or close methods", () => {
			const wrapper = mount();

			expect(wrapper.vm.open).toBeUndefined();
			expect(wrapper.vm.close).toBeUndefined();
		});

		test("renders an explicit close control with overridable text", () => {
			const wrapper = mount({
				slots: { "close-dialog-label": "Close details" },
			});

			const closeButton = wrapper.find('[data-test="overlay-sheet-close"]');

			expect(closeButton.text()).toBe("Close details");
			expect(closeButton.attributes("data-part")).toBe("close-button");
		});
	});

	describe("Controlled state", () => {
		test("opens and closes from the owning props", async () => {
			const wrapper = mount();

			await wrapper.setProps({ isOpen: true, isSheet: true });
			await waitForDialogUpdate();
			expect(wrapper.find("dialog").element.open).toBe(true);

			await wrapper.setProps({ isOpen: false });
			await waitForDialogUpdate();

			expect(wrapper.find("dialog").element.open).toBe(false);
			expect(wrapper.emitted("dismiss")).toBeUndefined();
		});

		test("applies the entrance animation only while the sheet is open", async () => {
			const wrapper = mount();
			const dialog = wrapper.find("dialog");

			await wrapper.setProps({ isOpen: true, isSheet: true });
			await waitForDialogUpdate();

			expect(dialog.classes()).toContain("animate-fade-in-up");

			await wrapper.setProps({ isOpen: false });
			await waitForDialogUpdate();

			expect(dialog.classes()).not.toContain("animate-fade-in-up");
		});
	});

	describe("Dismissal", () => {
		test("emits dismiss from a cancel event without changing controlled state", async () => {
			const wrapper = await mountOpen();

			await wrapper.find("dialog").trigger("cancel");

			expect(wrapper.find("dialog").element.open).toBe(true);
			expect(wrapper.emitted("dismiss")).toHaveLength(1);
		});

		test("does not dismiss from cancel when closeWithEscape is false", async () => {
			const wrapper = await mountOpen({ closeWithEscape: false });

			await wrapper.find("dialog").trigger("cancel");

			expect(wrapper.find("dialog").element.open).toBe(true);
			expect(wrapper.emitted("dismiss")).toBeUndefined();
		});

		test("emits dismiss from the explicit close control", async () => {
			const wrapper = await mountOpen();

			await wrapper.find('[data-test="overlay-sheet-close"]').trigger("click");

			expect(wrapper.find("dialog").element.open).toBe(true);
			expect(wrapper.emitted("dismiss")).toHaveLength(1);
		});

		test("does not dismiss when the dialog or its content is clicked", async () => {
			const wrapper = await mountOpen();

			await wrapper.find("dialog").trigger("click");
			await wrapper.find('[data-test="content"]').trigger("click");

			expect(wrapper.find("dialog").element.open).toBe(true);
			expect(wrapper.emitted("dismiss")).toBeUndefined();
		});

		test("emits dismiss when the native dialog closes unexpectedly", async () => {
			const wrapper = await mountOpen();

			wrapper.find("dialog").element.close();

			expect(wrapper.emitted("dismiss")).toHaveLength(1);
		});
	});

	describe("Presentation changes", () => {
		test("closes without dismissing when the sheet presentation ends", async () => {
			const wrapper = await mountOpen();

			await wrapper.setProps({ isSheet: false });
			await waitForDialogUpdate();

			expect(wrapper.find("dialog").element.open).toBe(false);
			expect(wrapper.emitted("dismiss")).toBeUndefined();
		});

		test("ignores an asynchronous close event after the sheet presentation ends", async () => {
			const wrapper = await mountOpen();
			const dialog = wrapper.find("dialog").element;

			dialog.close = vi.fn(() => dialog.removeAttribute("open"));

			await wrapper.setProps({ isSheet: false });
			await waitForDialogUpdate();

			dialog.dispatchEvent(new Event("close"));

			expect(wrapper.emitted("dismiss")).toBeUndefined();
		});

		test("moves the open content between the in-place and dialog presentations", async () => {
			const wrapper = mount();

			await wrapper.setProps({ isOpen: true });
			await waitForDialogUpdate();
			const content = wrapper.find('[data-test="content"]');

			expect(content.element.parentElement).not.toBe(wrapper.find("dialog").element);

			await wrapper.setProps({ isSheet: true });
			await waitForDialogUpdate();

			expect(wrapper.find("dialog").element.open).toBe(true);
			expect(wrapper.find('[data-test="content"]').element.parentElement).toBe(
				wrapper.find("dialog").element,
			);

			await wrapper.setProps({ isSheet: false });
			await waitForDialogUpdate();

			expect(wrapper.find("dialog").element.open).toBe(false);
			expect(wrapper.find('[data-test="content"]').element.parentElement).not.toBe(
				wrapper.find("dialog").element,
			);
		});
	});
});

async function waitForDialogUpdate() {
	await nextTick();
	await nextTick();
}

async function mountOpen(props = {}) {
	const wrapper = mount({ props });

	await wrapper.setProps({ isOpen: true, isSheet: true });
	await waitForDialogUpdate();

	return wrapper;
}
