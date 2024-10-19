import AlertMessage from "./alert-message.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(AlertMessage);

describe("alert-message", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("alert-message").shouldBeVisible();
	});
});
