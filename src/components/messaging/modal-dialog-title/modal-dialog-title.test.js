import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import ModalDialogTitle from "./modal-dialog-title.vue";

const defaultSlots = { default: "Confirm action" };
const mount = createMount(ModalDialogTitle, { slots: defaultSlots });

describe("modal-dialog-title", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Subtitle", () => {
		test("should render a subtitle when the subtitle slot is provided", () => {
			const wrapper = mount({
				slots: { default: "Title", subtitle: "Additional context" },
			});

			expect(wrapper.text()).toContain("Additional context");
		});

		test("should not render a subtitle when the subtitle slot is empty", () => {
			const wrapper = mount({
				slots: { default: "Title", subtitle: "" },
			});

			expect(wrapper.find('[data-test="modal-dialog-title"] > div').exists()).toBe(false);
		});
	});
});
