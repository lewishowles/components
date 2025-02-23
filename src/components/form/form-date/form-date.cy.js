import FormDate from "./form-date.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FormDate);

describe("form-date", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("form-date").shouldBeVisible();
		cy.getByData("form-date-day").shouldBeVisible();
		cy.getByData("form-date-month").shouldBeVisible();
		cy.getByData("form-date-year").shouldBeVisible();
		cy.getByData("form-label").shouldHaveCount(3);
	});

	it("A required parameter is passed to the date fields", () => {
		mount({ required: true });

		cy.getFormField("form-date-day").shouldHaveAttribute("required", "required");
		cy.getFormField("form-date-month").shouldHaveAttribute("required", "required");
		cy.getFormField("form-date-year").shouldHaveAttribute("required", "required");
	});
});
