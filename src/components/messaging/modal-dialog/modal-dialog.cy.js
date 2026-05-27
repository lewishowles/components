import ModalDialog from "./modal-dialog.vue";
import ModalDialogInteractionTest from "./test-fixtures/interaction-test.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(ModalDialogInteractionTest);
const mountDirectly = createMount(ModalDialog, { props: { initiallyOpen: true } });

describe("modal-dialog", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("modal-dialog").shouldNotBeVisible();
	});

	describe("Accessibility", () => {
		it("Has aria-modal=true", () => {
			mountDirectly({ slots: { title: "Dialog title" } });

			cy.getByData("modal-dialog").shouldHaveAttribute("aria-modal", "true");
		});

		it("Has aria-labelledby pointing to the title id when a title is provided", () => {
			mountDirectly({ slots: { title: "Dialog title" } });

			cy.getByData("modal-dialog-title")
				.invoke("attr", "id")
				.then((titleId) => {
					cy.getByData("modal-dialog").shouldHaveAttribute("aria-labelledby", titleId);
				});
		});

		it("Has role=alertdialog when variant is alert", () => {
			mountDirectly({
				props: { initiallyOpen: true, variant: "alert" },
				slots: { title: "Alert title" },
			});

			cy.getByData("modal-dialog").shouldHaveAttribute("role", "alertdialog");
		});

		it("Does not override the implicit dialog role by default", () => {
			mountDirectly({ slots: { title: "Dialog title" } });

			cy.getByData("modal-dialog").shouldNotHaveAttribute("role");
		});

		it("Automatically wraps content with a description element when variant is alert", () => {
			mountDirectly({
				props: { variant: "alert" },
				slots: { title: "Alert title", default: "This is the alert content" },
			});

			cy.getByData("modal-dialog")
				.invoke("attr", "aria-describedby")
				.then((descriptionId) => {
					cy.get(`#${descriptionId}`).shouldHaveText("This is the alert content");
				});
		});
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
