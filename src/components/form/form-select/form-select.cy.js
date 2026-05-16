import FormSelect from "./form-select.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FormSelect);

describe("form-select", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-select").shouldBeVisible();
	});

	describe("aria-invalid", () => {
		it("is set when an error is provided", () => {
			mount({ slots: { error: "Error text" } });

			cy.getFormField("form-select").shouldHaveAttribute("aria-invalid", "true");
		});

		it("is not set without an error", () => {
			mount();

			cy.getFormField("form-select").shouldNotHaveAttribute("aria-invalid");
		});
	});
});
