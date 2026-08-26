import { createMount } from "@lewishowles/testing/vue";
import { defineComponent, h } from "vue";
import { describe, expect, test, vi } from "vite-plus/test";

import FormSubmitFeedback from "./form-submit-feedback.vue";

const focusAlert = vi.fn();

const AlertMessageStub = defineComponent({
	name: "AlertMessage",
	setup(_, { expose }) {
		expose({ focus: focusAlert });

		return () => h("div");
	},
});

const mount = createMount(FormSubmitFeedback, {
	global: { stubs: { "alert-message": AlertMessageStub } },
	props: {
		errors: ["The form is invalid"],
		showErrors: true,
		testPrefix: "form-submit-feedback",
	},
});

describe("form-submit-feedback", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		test("focuses the general error alert", () => {
			const wrapper = mount();

			wrapper.vm.focus();

			expect(focusAlert).toHaveBeenCalledOnce();
		});
	});
});
