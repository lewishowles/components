import FormDate from "./form-date.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { id: "id-abc" };
const defaultSlots = { default: "When did you first request help?" };
const mount = createMount(FormDate, { props: defaultProps, slots: defaultSlots });

describe("form-date", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-date").shouldBeVisible();
		cy.getByData("form-date-day").shouldBeVisible();
		cy.getByData("form-date-month").shouldBeVisible();
		cy.getByData("form-date-year").shouldBeVisible();
		cy.getByData("form-label").shouldHaveCount(4);
	});

	it("A required parameter is passed to the date fields", () => {
		mount({ required: true });

		cy.getFormField("form-date-day").shouldHaveAttribute("required", "required");
		cy.getFormField("form-date-month").shouldHaveAttribute("required", "required");
		cy.getFormField("form-date-year").shouldHaveAttribute("required", "required");
	});

	it("An initial date can be provided in ISO format", () => {
		mount({ modelValue: "2025-02-24" });

		cy.getFormField("form-date-day").shouldHaveValue("24");
		cy.getFormField("form-date-month").shouldHaveValue("2");
		cy.getFormField("form-date-year").shouldHaveValue("2025");
	});

	describe("aria-invalid", () => {
		it("is set on the fieldset when an error is provided", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-date").shouldHaveAttribute("aria-invalid", "true");
		});

		it("is not set without an error", () => {
			mount();

			cy.getByData("form-date").shouldNotHaveAttribute("aria-invalid");
		});
	});

	describe("Supplementary information", () => {
		it("Help can be supplied", () => {
			mount({ slots: { help: "Help text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");
		});

		it("An error can be supplied", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");
		});

		it("Both help and an error can be supplied", () => {
			mount({ slots: { help: "Help text", error: "Error text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");
		});
	});

	describe("Styling hooks", () => {
		it("data-component is set on the root element", () => {
			mount();

			cy.getByData("form-date").shouldHaveAttribute("data-component", "form-date");
		});

		it("data-invalid is set when the field has an error", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-date").shouldHaveAttribute("data-invalid");
		});

		it("data-invalid is not set without an error", () => {
			mount();

			cy.getByData("form-date").shouldNotHaveAttribute("data-invalid");
		});
	});
});
