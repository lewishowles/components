import BaseModal from "./base-modal.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(BaseModal);

describe("base-modal", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("base-modal").shouldBeVisible();
	});
});
