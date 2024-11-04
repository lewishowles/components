import FormField from "./form-field.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Your name" };
const mount = createMount(FormField, { slots: defaultSlots });

describe("form-field", () => {
	it("Each field type can be rendered", () => {
		[
			[{ type: "text" }, "form-input"],
			[{ type: "email" }, "form-input"],
			[{ type: "password" }, "form-input"],
			[{ type: "textarea" }, "form-textarea"],
			[{ type: "checkbox" }, "form-checkbox"],
			[{ type: "radio-group", options: [] }, "radio-group"],
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
});
