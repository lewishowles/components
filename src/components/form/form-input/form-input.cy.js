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
			.shouldHaveAttribute("id");
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
