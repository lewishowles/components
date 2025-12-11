import ModalDialogTitle from "./modal-dialog-title.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(ModalDialogTitle);

describe("modal-dialog-title", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("modal-dialog-title").shouldBeVisible();
	});
});
