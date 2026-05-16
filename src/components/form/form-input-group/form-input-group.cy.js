import FormInputGroup from "./form-input-group.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { type: "radio", options: ["Yes", "No"] };
const mount = createMount(FormInputGroup, { props: defaultProps });

describe("form-input-group", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-input-group").shouldBeVisible();
	});

	describe("aria-invalid", () => {
		it("is set on the fieldset when an error is provided", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-input-group").shouldHaveAttribute("aria-invalid", "true");
		});

		it("is not set without an error", () => {
			mount();

			cy.getByData("form-input-group").shouldNotHaveAttribute("aria-invalid");
		});
	});

	describe("required", () => {
		it("sets aria-required on the fieldset when required", () => {
			mount({ required: true });

			cy.getByData("form-input-group").shouldHaveAttribute("aria-required", "true");
		});

		it("does not set aria-required when not required", () => {
			mount();

			cy.getByData("form-input-group").shouldNotHaveAttribute("aria-required");
		});
	});
});
