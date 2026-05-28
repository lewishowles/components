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

	describe("Styling hooks", () => {
		it("data-component is set on the root element", () => {
			mount();

			cy.getByData("form-select").shouldHaveAttribute("data-component", "form-select");
		});

		it("data-invalid is set when the field has an error", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-select").shouldHaveAttribute("data-invalid");
		});

		it("data-invalid is not set without an error", () => {
			mount();

			cy.getByData("form-select").shouldNotHaveAttribute("data-invalid");
		});
	});
});
