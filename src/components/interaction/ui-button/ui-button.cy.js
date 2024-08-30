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

	it("An icon can be added to the start", () => {
		mount({ iconStart: "icon-chevron-left" });

		cy.getByData("ui-button-icon-start").shouldBeVisible();
		cy.getByData("link-tag-icon-end").should("not.exist");
	});

	it("An icon can be added to the end", () => {
		mount({ iconEnd: "icon-chevron-right" });

		cy.getByData("link-tag-icon-start").should("not.exist");
		cy.getByData("ui-button-icon-end").shouldBeVisible();
	});

	it("Reactive buttons show a loading indicator when activated", () => {
		mount({ reactive: "true", iconEnd: "icon-chevron-right" });

		cy.getByData("ui-button-label").shouldBeVisible();
		cy.getByData("ui-button-icon-end").shouldBeVisible();
		cy.getByData("ui-button-loading").shouldNotBeVisible();

		cy.getByData("ui-button").click();

		cy.getByData("ui-button-label").shouldNotBeVisible();
		cy.getByData("ui-button-icon-end").shouldNotBeVisible();
		cy.getByData("ui-button-loading").shouldBeVisible();
	});
});
