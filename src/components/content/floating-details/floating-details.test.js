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

			const detailsClasses = summaryDetails.props("detailsClasses");

			expect(detailsClasses).not.toContain("w-screen");
			expect(detailsClasses).not.toContain("border");
			expect(detailsClasses).not.toContain("shadow");
			expect(detailsClasses).not.toContain("backdrop-blur-lg");
		});

		test("removes the positioning visibility class when crossing to narrow while open", async () => {
			const wrapper = mount();
			const summaryDetails = wrapper.findComponent({ name: "SummaryDetails" });

			summaryDetails.vm.$emit("open");

			expect(wrapper.vm.isPositioning).toBe(true);

			isNarrow.value = true;
			await nextTick();

			expect(summaryDetails.props("detailsClasses")).not.toContain("invisible");
		});

		test("does not enable desktop floating dismissal behaviour", async () => {
			const wrapper = mountDeep({
				slots: {
					default: "Details content",
					summary: "Summary",
				},
			});

			isNarrow.value = true;
			await nextTick();

			await wrapper.find('[data-test="floating-details-summary"]').trigger("click");
			await nextTick();

			const summaryDetails = wrapper.findComponent({ name: "SummaryDetails" });

			expect(summaryDetails.props("closeWithClickOutside")).toBe(false);
			expect(summaryDetails.props("floating")).toBe(false);
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
	});
});
