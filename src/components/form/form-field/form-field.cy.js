import FormField from "./form-field.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { name: "name" };
const defaultSlots = { default: "Your name" };
const mount = createMount(FormField, { props: defaultProps, slots: defaultSlots });

describe("form-field", () => {
	it("Each field type can be rendered", () => {
		[
			[{ type: "text" }, "form-input"],
			[{ type: "email" }, "form-input"],
			[{ type: "password" }, "form-input"],
			[{ type: "textarea" }, "form-textarea"],
			[{ type: "checkbox" }, "form-checkbox"],
			[{ type: "radio-group", options: [] }, "form-radio-group"],
			[{ type: "checkbox-group", options: [] }, "form-radio-group"],
			[{ type: "button-group", options: [] }, "button-group"],
		].forEach(([props, component]) => {
			mount({ props });

			cy.getByData(component).shouldBeVisible();
		});
	});

	it("An appropriate default field is rendered", () => {
		mount();

		cy.getByData("form-input").shouldBeVisible();
	});

	it("Additional props are passed through to the underlying field", () => {
		mount({ id: "custom-unique-id" });

		cy.getFormField("form-input").shouldBeVisible().shouldHaveAttribute("id", "custom-unique-id");
	});

	describe("Validation", () => {
		it("The `required` rule adds appropriate attributes", () => {
			mount();

			cy.getByData("form-input").shouldBeVisible();
		});
	});
});
