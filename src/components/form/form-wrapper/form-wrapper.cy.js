import FormField from "@/components/form/form-field/form-field.vue";
import FormWrapper from "./form-wrapper.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = {
	"default": [createField({ label: "Username", props: { name: "username" } })],
	"submit-button-label": "Create user",
};

const mount = createMount(FormWrapper, { slots: defaultSlots });

describe("form-wrapper", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-input").shouldBeVisible();
	});

	it("`formData` is updated correctly", () => {
		mount();

		cy.get("@vue").then(wrapper => {
			// Assert initial model value
			expect(wrapper.vm.formData.username).to.eq(null);

			// Simulate user input to change the value
			cy.getByData("form-input").type("wall-e");

			// We get the form-input again here to ensure that the new expect is
			// run after the value has been updated.
			cy.getByData("form-input").then(() => {
				expect(wrapper.vm.formData.username).to.eq("wall-e");
			});
		});
	});

	describe("Slots", () => {
		it("The `default` slot can be utilised", () => {
			mount({ slots: { default: h("div", { "data-test": "default-slot-test" }, "Slot test") } });

			cy.getByData("default-slot-test").shouldBeVisible();
		});

		it("An error is shown if `submit-button-label` is not provided", () => {
			mount({ slots: { "submit-button-label": null } });

			cy.getByData("form-wrapper-submit-button-label-error").shouldBeVisible();
		});

		it("An error is not shown if `submit-button-label` is provided", () => {
			mount();

			cy.getByData("form-wrapper-submit-button-label-error").should("not.exist");
		});

		it("The `pre-form` slot can be utilised", () => {
			mount({ slots: { "pre-form": h("div", { "data-test": "pre-form-slot-test" }, "Slot test") } });

			cy.getByData("pre-form-slot-test").shouldBeVisible();
		});

		it("The `secondary-actions` slot can be utilised", () => {
			mount({ slots: { "secondary-actions": h("div", { "data-test": "secondary-actions-slot-test" }, "Slot test") } });

			cy.getByData("secondary-actions-slot-test").shouldBeVisible();
		});

		it("The `tertiary-actions` slot can be utilised", () => {
			mount({ slots: { "tertiary-actions": h("div", { "data-test": "tertiary-actions-slot-test" }, "Slot test") } });

			cy.getByData("tertiary-actions-slot-test").shouldBeVisible();
		});
	});
});

/**
 * Simplify the process of creating a form field to test with.
 *
 * @param  {string}  options.label
 *     The label of the field.
 * @param  {object}  options.props
 *     Any props to pass to the field.
 */
function createField({ label, props }) {
	return h(FormField, props, {
		default: () => label,
	});
}
