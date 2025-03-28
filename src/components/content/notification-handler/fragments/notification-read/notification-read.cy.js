import NotificationRead from "./notification-read.vue";
import { createMount } from "@cypress/support/mount";

const notificationMessage = "Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";
const notification = { id: "notification-1", message: notificationMessage };
const defaultProps = { notification };
const mount = createMount(NotificationRead, { props: defaultProps });

describe("notification-read", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-read").shouldBeVisible();
		cy.getByData("notification-read").shouldHaveText(notificationMessage);
		cy.getByData("notification-read-stripe").shouldNotBeVisible();
		cy.getByData("notification-read-badge").shouldNotBeVisible();
	});
});
