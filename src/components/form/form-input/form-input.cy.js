import FormInput from "./form-input.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { id: "id-abc" };
const defaultSlots = { default: "Your name" };
const mount = createMount(FormInput, { props: defaultProps, slots: defaultSlots });

describe("form-input", () => {
	it("A text input is rendered", () => {
		mount();

		cy.getByData("form-input").shouldBeVisible();

		cy.getByData("form-input")
			.getFormField()
			.shouldHaveAttribute("id", "id-abc");

		cy.getByData("form-input")
			.getByData("form-label")
			.shouldHaveText("Your name");
	});
});
