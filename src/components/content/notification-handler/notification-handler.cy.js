import NotificationHandler from "./notification-handler.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(NotificationHandler);

describe("notification-handler", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-handler").shouldBeVisible();
	});
});
