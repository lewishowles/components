import BaseModal from "./base-modal.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(BaseModal);

describe("base-modal", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("modal-dialog").shouldBeVisible();
	});

	it("Has aria-modal=true", () => {
		mount();

		cy.getByData("modal-dialog").shouldHaveAttribute("aria-modal", "true");
	});

	it("Applies aria-labelledby when provided", () => {
		mount({ ariaLabelledby: "title-id" });

		cy.getByData("modal-dialog").shouldHaveAttribute("aria-labelledby", "title-id");
	});

	it("Does not set aria-labelledby when not provided", () => {
		mount();

		cy.getByData("modal-dialog").shouldNotHaveAttribute("aria-labelledby");
	});

	it("Applies role=alertdialog when dialogRole is alertdialog", () => {
		mount({ dialogRole: "alertdialog" });

		cy.getByData("modal-dialog").shouldHaveAttribute("role", "alertdialog");
	});

	it("Does not override the implicit dialog role when dialogRole is not set", () => {
		mount();

		cy.getByData("modal-dialog").shouldNotHaveAttribute("role");
	});
});
