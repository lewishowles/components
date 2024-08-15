import FormInput from "./form-input.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { id: "id-abc" };
const defaultSlots = { default: "Your name" };
const mount = createMount(FormInput, { props: defaultProps, slots: defaultSlots });

describe("form-input", () => {
	it("A text input is rendered", () => {
		mount();

		cy.getByData("form-input").shouldBeVisible();

		cy.getFormField("form-input")
			.shouldHaveAttribute("id", "id-abc");

		cy.getByData("form-input")
			.getByData("form-label")
			.shouldHaveText("Your name")
			.shouldHaveAttribute("for", "id-abc");
	});

	it("Additional attributes can be provided to the input", () => {
		mount({ inputAttributes: { autocomplete: "given-name" } });

		cy.getFormField("form-input").shouldHaveAttribute("autocomplete", "given-name");
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

	describe("Decoration", () => {
		it("An icon can be added to the start", () => {
			mount({ iconStart: "icon-chevron-left" });

			cy.getByData("form-input-icon-start").shouldBeVisible();
		});

		it("An icon can be added to the end", () => {
			mount({ iconEnd: "icon-chevron-right" });

			cy.getByData("form-input-icon-end").shouldBeVisible();
		});

		it("Text can be added to the start", () => {
			mount({ slots: { "text-start": "https://" } });

			cy.getByData("form-input-text-start").shouldBeVisible();
		});

		it("Text can be added to the end", () => {
			mount({ slots: { "text-end": "mph" } });

			cy.getByData("form-input-text-end").shouldBeVisible();
		});
	});
});
