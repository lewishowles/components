import FormField from "@/components/form/form-field/form-field.vue";
import FormWrapper from "./form-wrapper.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = {
	default: [createField({ label: "Username", props: { name: "username" } })],
};

const mount = createMount(FormWrapper, { slots: defaultSlots });

describe("form-wrapper", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-input").shouldBeVisible();
	});

	it("Updates formData correctly", () => {
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
