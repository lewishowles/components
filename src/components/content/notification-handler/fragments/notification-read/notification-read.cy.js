import NotificationRead from "./notification-read.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(NotificationRead);

describe("notification-read", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-read").shouldBeVisible();
	});
});
