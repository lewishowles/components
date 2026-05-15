import ModalDialogTitle from "./modal-dialog-title.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Confirm action" };
const mount = createMount(ModalDialogTitle, { slots: defaultSlots });

describe("modal-dialog-title", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("modal-dialog-title").shouldBeVisible();
	});
});
