import NotificationInfo from "./notification-info.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(NotificationInfo);

describe("notification-info", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-info").shouldBeVisible();
	});
});
