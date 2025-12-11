import ModalDialogActions from "./modal-dialog-actions.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(ModalDialogActions);

describe("modal-dialog-actions", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("modal-dialog-actions").shouldBeVisible();
	});
});
