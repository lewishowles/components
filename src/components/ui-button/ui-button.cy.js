import UiButton from "./ui-button.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "button--primary" };
const defaultSlots = { default: "Button label" };
const mount = createMount(UiButton, { props: defaultProps, slots: defaultSlots });

describe("ui-button", () => {
	it("A button is rendered", () => {
		mount();

		cy.getByData("ui-button").shouldHaveText("Button label");
	});

	it("A start icon can be added", () => {
		mount({ iconStart: "icon-chevron-left" });

		cy.getByData("ui-button").find("svg").shouldBeVisible();
	});

	it("An end icon can be added", () => {
		mount({ iconEnd: "icon-chevron-right" });

		cy.getByData("ui-button").find("svg").shouldBeVisible();
	});
});