import { createMount } from "@cypress/support/mount";
import FormTextarea from "./form-textarea.vue";

const defaultProps = { id: "id-abc" };
const defaultSlots = { default: "Your name" };
const mount = createMount(FormTextarea, { props: defaultProps, slots: defaultSlots });

describe("form-textarea", () => {
	it("A textarea is rendered", () => {
		mount();

		cy.getByData("form-textarea").shouldBeVisible();

		cy.getFormField("form-textarea")
			.shouldHaveAttribute("id", "id-abc");

		cy.getByData("form-textarea")
			.getByData("form-label")
			.shouldHaveText("Your name")
			.shouldHaveAttribute("for", "id-abc");
	});

	it("Additional attributes can be provided to the textarea", () => {
		mount({ inputAttributes: { autocomplete: "given-name" } });

		cy.getFormField("form-textarea").shouldHaveAttribute("autocomplete", "given-name");
	});

	describe("Supplementary information", () => {
		it("Help can be supplied", () => {
			mount({ slots: { help: "Help text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");

			cy.getFormField("form-textarea")
				.shouldHaveAttribute("aria-describedby", "id-abc-help");
		});

		it("An error can be supplied", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");

			cy.getFormField("form-textarea")
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

			cy.getFormField("form-textarea")
				.shouldHaveAttribute("aria-describedby", "id-abc-help id-abc-error");
		});
	});
});
