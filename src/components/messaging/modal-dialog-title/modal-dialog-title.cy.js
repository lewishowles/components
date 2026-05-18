import ModalDialogTitle from "./modal-dialog-title.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Confirm action" };
const mount = createMount(ModalDialogTitle, { slots: defaultSlots });

describe("modal-dialog-title", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("modal-dialog-title").shouldBeVisible();
	});

	it("Has tabindex=-1 so it can receive programmatic focus without entering the tab order", () => {
		mount();

		cy.getByData("modal-dialog-title").shouldHaveAttribute("tabindex", "-1");
	});

	it("Has a non-empty id attribute", () => {
		mount();

		cy.getByData("modal-dialog-title").invoke("attr", "id").should("be.a", "string").and("not.be.empty");
	});

	it("Uses the provided titleId as its id", () => {
		mount({ props: {}, global: { provide: { "modal-dialog-title-id": "custom-title-id" } } });

		cy.getByData("modal-dialog-title").shouldHaveAttribute("id", "custom-title-id");
	});
});
