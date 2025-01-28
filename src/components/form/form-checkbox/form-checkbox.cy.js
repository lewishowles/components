import { createMount } from "@cypress/support/mount";
import FormCheckbox from "./form-checkbox.vue";

const defaultProps = { id: "id-abc" };
const defaultSlots = { default: "Your name" };
const mount = createMount(FormCheckbox, { props: defaultProps, slots: defaultSlots });

describe("form-checkbox", () => {
	it("A checkbox is rendered", () => {
		mount();

		cy.getByData("form-checkbox").shouldBeVisible();

		cy.getByData("form-label-no-label").should("not.exist");

		cy.getFormField("form-checkbox")
			.shouldHaveAttribute("id", "id-abc")
			.shouldHaveAttribute("type", "checkbox");

		cy.getByData("form-checkbox")
			.getByData("form-label")
			.shouldHaveText("Your name")
			.shouldHaveAttribute("for", "id-abc");
	});

	describe("Label", () => {
		it("A label is required", () => {
			mount({ slots: { default: "" } });

			cy.getByData("form-label-no-label").shouldBeVisible();
		});

		it("A label can be hidden", () => {
			mount({ displayLabel: false });

			cy.getByData("form-label").shouldHaveClass("sr-only");
		});
	});

	it("Additional attributes can be provided to the input", () => {
		mount({ inputAttributes: { required: true } });

		cy.getFormField("form-checkbox").shouldHaveAttribute("required");
	});

	describe("Supplementary information", () => {
		it("Help can be supplied", () => {
			mount({ slots: { help: "Help text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");

			cy.getFormField("form-checkbox")
				.shouldHaveAttribute("aria-describedby", "id-abc-help");
		});

		it("An error can be supplied", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");

			cy.getFormField("form-checkbox")
				.shouldHaveAttribute("aria-describedby", "id-abc-error");
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

			cy.getFormField("form-checkbox")
				.shouldHaveAttribute("aria-describedby", "id-abc-help id-abc-error");
		});
	});
});
