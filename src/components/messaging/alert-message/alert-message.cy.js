import AlertMessage from "./alert-message.vue";
import IconArrowUp from "@/components/icon/icon-arrow-up/icon-arrow-up.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultProps = { type: "info" };
const defaultSlots = { default: "Alert message" };
const mount = createMount(AlertMessage, { props: defaultProps, slots: defaultSlots });

describe("alert-message", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("alert-message").shouldBeVisible();
		cy.getByData("alert-message-title").should("not.exist");
	});

	it("A title can be shown", () => {
		mount({ slots: { title: "Message title" } });

		cy.getByData("alert-message").shouldBeVisible();
		cy.getByData("alert-message-title").shouldBeVisible();
	});

	it("An icon is displayed", () => {
		mount();

		cy.getByData("alert-message-icon").shouldBeVisible();
	});

	it("A custom icon can be displayed", () => {
		mount({ slots: { icon: h(IconArrowUp) } });

		cy.getByData("alert-message-icon").should("not.exist");
		cy.getByData("alert-message").find("svg").shouldBeVisible();
	});

	it("A type prefix is shown for typed alerts", () => {
		mount({ props: { type: "error" } });

		cy.getByData("alert-message-type-prefix").should("exist");
	});

	it("No type prefix is shown for muted alerts", () => {
		mount({ props: { type: "muted" } });

		cy.getByData("alert-message-type-prefix").should("not.exist");
	});
});
