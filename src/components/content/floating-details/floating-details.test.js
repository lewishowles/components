import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { nextTick, ref } from "vue";
import { beforeEach, describe, expect, test, vi } from "vite-plus/test";

const isNarrow = ref(false);

vi.mock("@vueuse/core", async (importOriginal) => ({
	...(await importOriginal()),
	useMediaQuery: () => globalThis.__floatingDetailsIsNarrow,
}));

import FloatingDetails from "./floating-details.vue";

const mount = createMount(FloatingDetails);
const mountDeep = createDeepMount(FloatingDetails);

const mountWithRawSummaryDetails = createMount(FloatingDetails, {
	global: {
		stubs: {
			SummaryDetails: {
				name: "SummaryDetails",
				inheritAttrs: false,
				template: "<div />",
			},
		},
	},
});

globalThis.__floatingDetailsIsNarrow = isNarrow;

describe("floating-details", () => {
	beforeEach(() => {
		isNarrow.value = false;
	});

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("allows caller attributes to override root defaults", () => {
			const wrapper = mountDeep({
				attrs: { "data-test": "custom-floating-details" },
			});

			expect(wrapper.find("details").attributes("data-test")).toBe("custom-floating-details");
		});
	});

	describe("Narrow presentation", () => {
		test("does not forward floating panel chrome when narrow and open", async () => {
			const wrapper = mount();
			const summaryDetails = wrapper.findComponent({ name: "SummaryDetails" });

			summaryDetails.vm.$emit("open");

			isNarrow.value = true;
			await nextTick();

			expect(summaryDetails.props("detailsClasses")).toBe("mt-0");
		});

		test("removes the positioning visibility class when crossing to narrow while open", async () => {
			const wrapper = mount();
			const summaryDetails = wrapper.findComponent({ name: "SummaryDetails" });

			summaryDetails.vm.$emit("open");

			expect(wrapper.vm.isPositioning).toBe(true);

			isNarrow.value = true;
			await nextTick();

			expect(summaryDetails.props("detailsClasses")).toBe("mt-0");
		});

		test("forwards only the disclosure props needed by summary-details", async () => {
			const wrapper = mountWithRawSummaryDetails({ props: { align: "end" } });
			const summaryDetails = wrapper.findComponent({ name: "SummaryDetails" });

			for (const narrow of [true, false]) {
				isNarrow.value = narrow;
				await nextTick();

				const forwardedProps = summaryDetails.vm.$attrs;

				expect(forwardedProps).not.toHaveProperty("floating");
				expect(forwardedProps).not.toHaveProperty("align");
				expect(forwardedProps).not.toHaveProperty("placement");
				expect(forwardedProps).not.toHaveProperty("closeWithClickOutside");
				expect(forwardedProps).toHaveProperty("closeWithEscape", !narrow);
			}
		});

		test("does not close on outside click in narrow mode", async () => {
			const wrapper = mountDeep({
				props: { closeWithClickOutside: true },
				slots: {
					default: "Details content",
					summary: "Summary",
				},
			});

			isNarrow.value = true;
			await nextTick();
			await wrapper.find('[data-test="floating-details-summary"]').trigger("click");
			await nextTick();

			const outside = document.createElement("button");

			document.body.append(outside);
			outside.dispatchEvent(new Event("pointerdown", { bubbles: true }));
			await nextTick();

			expect(wrapper.find("details").element.open).toBe(true);

			outside.remove();
		});

		test("does not close on Escape in narrow mode when sheet Escape is disabled", async () => {
			const wrapper = mountDeep({
				props: { closeWithEscape: false },
				slots: {
					default: "Details content",
					summary: "Summary",
				},
			});

			isNarrow.value = true;
			await nextTick();
			await wrapper.find('[data-test="floating-details-summary"]').trigger("click");
			await nextTick();

			window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
			await nextTick();

			expect(wrapper.find("details").element.open).toBe(true);
		});

		test("forwards the narrow sheet close label", async () => {
			const wrapper = mountDeep({
				slots: {
					"close-dialog-label": "Close account",
					summary: "Summary",
				},
			});

			isNarrow.value = true;
			await nextTick();

			expect(wrapper.find('[data-test="overlay-sheet-close"]').text()).toBe("Close account");
		});

		test("does not close when clicking teleported content", async () => {
			const wrapper = mountDeep({
				props: { closeWithClickOutside: true },
				slots: {
					default: '<button data-test="teleported-content">Content</button>',
					summary: "Summary",
				},
			});

			isNarrow.value = true;
			await nextTick();

			await wrapper.find('[data-test="floating-details-summary"]').trigger("click");
			await nextTick();
			await nextTick();

			const details = wrapper.find("details").element;
			const dialog = wrapper.find("dialog").element;
			const content = wrapper.find('[data-test="teleported-content"]').element;

			expect(dialog.open).toBe(true);
			expect(dialog.contains(content)).toBe(true);

			content.dispatchEvent(new MouseEvent("click", { bubbles: true }));
			await nextTick();

			expect(details.open).toBe(true);
		});

		test("closes when a teleported link is activated", async () => {
			const wrapper = mountDeep({
				slots: {
					default: '<a href="#" data-test="teleported-link">Link</a>',
					summary: "Summary",
				},
			});

			isNarrow.value = true;
			await nextTick();

			await wrapper.find('[data-test="floating-details-summary"]').trigger("click");
			await nextTick();
			await nextTick();

			const details = wrapper.find("details").element;
			const link = wrapper.find('[data-test="teleported-link"]').element;

			link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
			await nextTick();

			expect(details.open).toBe(false);
		});

		test("closes the owning disclosure when the sheet is dismissed", async () => {
			isNarrow.value = true;

			const wrapper = mountDeep({
				slots: {
					default: "Details content",
					summary: "Summary",
				},
			});

			const details = wrapper.find("details").element;

			await wrapper.find('[data-test="floating-details-summary"]').trigger("click");
			await nextTick();

			expect(details.open).toBe(true);

			wrapper.findComponent({ name: "OverlaySheet" }).vm.$emit("dismiss");
			await nextTick();

			expect(details.open).toBe(false);
		});
	});

	describe("Wide presentation", () => {
		test("starts positioning synchronously when opened", () => {
			const wrapper = mount();
			const summaryDetails = wrapper.findComponent({ name: "SummaryDetails" });

			summaryDetails.vm.$emit("open");

			expect(wrapper.vm.isPositioning).toBe(true);
		});

		test("cancels summary-details' default margin below the trigger", async () => {
			const wrapper = mountDeep({
				slots: { default: "Details content", summary: "Summary" },
			});

			await wrapper.find('[data-test="floating-details-summary"]').trigger("click");
			await nextTick();

			const contentClasses = wrapper.find('[data-test="floating-details-content"]').classes();

			expect(contentClasses).toContain("mt-3");
			expect(contentClasses).not.toContain("mt-0");
			expect(contentClasses).not.toContain("mb-3");
		});

		test("cancels summary-details' default margin above the trigger", async () => {
			const wrapper = mountDeep({
				props: { placement: "above" },
				slots: { default: "Details content", summary: "Summary" },
			});

			await wrapper.find('[data-test="floating-details-summary"]').trigger("click");
			await nextTick();

			const contentClasses = wrapper.find('[data-test="floating-details-content"]').classes();

			expect(contentClasses).toContain("mb-3");
			expect(contentClasses).toContain("mt-0");
			expect(contentClasses).not.toContain("mt-3");
		});

		test("closes on outside pointerdown without moving focus", async () => {
			const wrapper = mountDeep({
				slots: {
					default: "Details content",
					summary: "Summary",
				},
			});

			const summary = wrapper.find('[data-test="floating-details-summary"]');

			await summary.trigger("click");
			await nextTick();

			const outside = document.createElement("button");

			document.body.append(outside);
			outside.focus();
			outside.dispatchEvent(new Event("pointerdown", { bubbles: true }));
			outside.click();
			await nextTick();

			expect(wrapper.find("details").element.open).toBe(false);
			expect(outside).toBe(document.activeElement);

			outside.remove();
		});

		test("ignores pointerdown on the summary element", async () => {
			const wrapper = mountDeep({
				slots: {
					default: "Details content",
					summary: "Summary",
				},
			});

			const summary = wrapper.find('[data-test="floating-details-summary"]');

			await summary.trigger("click");
			await nextTick();
			summary.element.dispatchEvent(new Event("pointerdown", { bubbles: true }));
			await nextTick();

			expect(wrapper.find("details").element.open).toBe(true);
		});

		test("does not close on outside pointerdown when closeWithClickOutside is false", async () => {
			const wrapper = mountDeep({
				props: { closeWithClickOutside: false },
				slots: {
					default: "Details content",
					summary: "Summary",
				},
			});

			const summary = wrapper.find('[data-test="floating-details-summary"]');

			await summary.trigger("click");
			await nextTick();

			const outside = document.createElement("button");

			document.body.append(outside);
			outside.dispatchEvent(new Event("pointerdown", { bubbles: true }));
			outside.click();
			await nextTick();

			expect(wrapper.find("details").element.open).toBe(true);

			outside.remove();
		});
	});
});
