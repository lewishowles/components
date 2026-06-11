import FieldWrapper from "./fragments/field-wrapper/field-wrapper.vue";
import FormActions from "./form-actions/form-actions.vue";
import FormError from "./fragments/form-error/form-error.vue";
import FormHelp from "./fragments/form-help/form-help.vue";
import FormLabel from "./form-label/form-label.vue";
import FormLayout from "./form-layout/form-layout.vue";
import FormPrefix from "./fragments/form-prefix/form-prefix.vue";
import FormSuffix from "./fragments/form-suffix/form-suffix.vue";
import FormSupplementary from "./fragments/form-supplementary/form-supplementary.vue";
import { createMount } from "@cypress/support/mount";

describe("form fragments", () => {
	describe("field-wrapper", () => {
		const defaultSlots = { default: () => "Field" };
		const mount = createMount(FieldWrapper, { slots: defaultSlots });

		it("A component is rendered", () => {
			mount();

			cy.getByData("field-wrapper").shouldBeVisible();
		});
	});

	describe("form-actions", () => {
		const defaultSlots = { default: "Form placeholder" };
		const mount = createMount(FormActions, { slots: defaultSlots });

		it("Renders a form actions wrapper", () => {
			mount();

			cy.getByData("form-actions").shouldBeVisible();
		});
	});

	describe("form-error", () => {
		const defaultSlots = { default: "Error message" };
		const mount = createMount(FormError, { slots: defaultSlots });

		it("Renders help", () => {
			mount();

			cy.getByData("form-error").shouldBeVisible();
		});
	});

	describe("form-help", () => {
		const defaultSlots = { default: "Help text" };
		const mount = createMount(FormHelp, { slots: defaultSlots });

		it("Renders help", () => {
			mount();

			cy.getByData("form-help").shouldBeVisible();
		});
	});

	describe("form-label", () => {
		const defaultProps = { id: "id-abc" };
		const defaultSlots = { default: "Your name" };
		const mount = createMount(FormLabel, { props: defaultProps, slots: defaultSlots });

		it("A label is rendered", () => {
			mount();

			cy.getByData("form-label").shouldBeVisible().shouldHaveAttribute("for", "id-abc");
		});
	});

	describe("form-layout", () => {
		const defaultSlots = { default: "Form placeholder" };
		const mount = createMount(FormLayout, { slots: defaultSlots });

		it("Renders a form layout", () => {
			mount();

			cy.getByData("form-layout").shouldBeVisible();
		});
	});

	describe("form-prefix", () => {
		const defaultSlots = { default: "£" };
		const mount = createMount(FormPrefix, { slots: defaultSlots });

		it("A component is rendered", () => {
			mount();

			cy.getByData("form-prefix").shouldBeVisible();
		});
	});

	describe("form-suffix", () => {
		const defaultSlots = { default: ".com" };
		const mount = createMount(FormSuffix, { slots: defaultSlots });

		it("A component is rendered", () => {
			mount();

			cy.getByData("form-suffix").shouldBeVisible();
		});
	});

	describe("form-supplementary", () => {
		const defaultProps = { inputId: "id-abc" };
		const mount = createMount(FormSupplementary, { props: defaultProps });

		it("renders nothing without supplementary content", () => {
			mount();

			cy.getByData("form-help").should("not.exist");
		});
	});
});
