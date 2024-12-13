import ModalDialogInteractionTest from "./modal-dialog-interaction-test.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(ModalDialogInteractionTest);

describe("modal-dialog", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("modal-dialog").shouldNotBeVisible();
	});

	describe("Interaction", () => {
		it("A dialog can be opened", () => {
			mount();

			openDialog();
		});

		it("A dialog can be closed via the close button", () => {
			mount();

			openDialog();

			closeDialog();
		});

		it("A dialog can be closed via escape", () => {
			mount();

			openDialog();

			cy.realPress("Escape");

			cy.getByData("modal-dialog").shouldNotBeVisible();
		});

		it("A dialog can be closed via a button", () => {
			mount();

			openDialog();

			closeDialogViaInternalButton();
		});

		it("Focus is managed", () => {
			mount();

			openDialog();

			cy.getByData("modal-dialog").shouldHaveFocus();

			cy.realPress("Tab");

			cy.getByData("modal-dialog-close").shouldHaveFocus();

			cy.realPress("Tab");

			cy.getByData("modal-dialog-interaction-test-confirm").shouldHaveFocus();

			cy.realPress("Tab");

			cy.getByData("modal-dialog-interaction-test-close").shouldHaveFocus();
		});
	});
});

function openDialog() {
	cy.getByData("modal-dialog").shouldNotBeVisible();

	cy.getByData("modal-dialog-interaction-test-open").click();

	cy.getByData("modal-dialog").shouldBeVisible();
}

function closeDialog() {
	cy.getByData("modal-dialog").shouldBeVisible();

	cy.getByData("modal-dialog-close").click();

	cy.getByData("modal-dialog").shouldNotBeVisible();
}

function closeDialogViaInternalButton() {
	cy.getByData("modal-dialog").shouldBeVisible();

	cy.getByData("modal-dialog-interaction-test-close").click();

	cy.getByData("modal-dialog").shouldNotBeVisible();
}
