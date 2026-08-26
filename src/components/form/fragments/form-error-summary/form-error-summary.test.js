import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";

import FormErrorSummary from "./form-error-summary.vue";

const mount = createMount(FormErrorSummary);

describe("form-error-summary", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Error entries", () => {
		test("renders field errors as links and other errors as text", async () => {
			const focusField = vi.fn();

			const wrapper = mount({
				props: {
					errors: [
						{ fieldName: "email", id: "email-id", message: "Enter an email address" },
						{ message: "The form is unavailable" },
					],
					focusField,
					showErrors: true,
					testPrefix: "form-flow",
				},
			});

			const link = wrapper.get('[data-test="form-flow-error-summary-message"]');

			expect(link.attributes("href")).toBe("#email-id");
			expect(wrapper.findAll("a")).toHaveLength(1);
			expect(wrapper.find("span").text()).toBe("The form is unavailable");

			await link.trigger("click");

			expect(focusField).toHaveBeenCalledWith("email");
		});
	});
});
