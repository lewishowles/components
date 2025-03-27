import NotificationBase from "./notification-base.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(NotificationBase);

describe("notification-base", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-base").shouldBeVisible();
	});
});
