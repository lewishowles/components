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
		cy.getByData("ui-button-icon-end").should("not.exist");
	});

	it("An icon can be added to the end", () => {
		mount({ iconEnd: "icon-chevron-right" });

		cy.getByData("ui-button-icon-start").should("not.exist");
		cy.getByData("ui-button-icon-end").shouldBeVisible();
	});

	it("An icon can be shown on its own", () => {
		mount({ iconStart: "icon-chevron-right", iconOnly: true });

		cy.getByData("ui-button-icon-end").should("not.exist");
		cy.getByData("ui-button-icon-start").shouldBeVisible();
		cy.getByData("ui-button-icon-start").shouldHaveClass("size-[1em]");
		cy.getByData("ui-button-label").shouldBeVisible();
		cy.getByData("ui-button-label").shouldHaveClass("sr-only");
	});

	it("A reactive button populates the status region when activated", () => {
		mount({ reactive: "true" });

		cy.getByData("ui-button").click();

		cy.getByData("ui-button-status").shouldHaveText("Loading");
	});

	it("A reactive button clears the status region when reset", () => {
		mount({ reactive: "true" });

		cy.getByData("ui-button").click();

		cy.getComponent().then(component => {
			component.reset();

			cy.getByData("ui-button-status").shouldHaveText("");
		});
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

	it("A disabled button has aria-disabled", () => {
		mount({ disabled: true });

		cy.getByData("ui-button").shouldHaveAttribute("aria-disabled", "true");
	});

	it("A disabled button does not have the native disabled attribute", () => {
		mount({ disabled: true });

		cy.getByData("ui-button").shouldNotHaveAttribute("disabled");
	});

	it("A non-disabled button does not have aria-disabled", () => {
		mount();

		cy.getByData("ui-button").shouldNotHaveAttribute("aria-disabled");
	});

	it("A disabled button swallows click events", () => {
		mount({ reactive: "true", disabled: true });

		cy.getByData("ui-button").click();

		cy.getByData("ui-button-loading").shouldNotBeVisible();
	});

	it("A toggle button has aria-pressed when pressed is true", () => {
		mount({ pressed: true });

		cy.getByData("ui-button").shouldHaveAttribute("aria-pressed", "true");
	});

	it("A toggle button has aria-pressed when pressed is false", () => {
		mount({ pressed: false });

		cy.getByData("ui-button").shouldHaveAttribute("aria-pressed", "false");
	});

	it("A button without pressed does not have aria-pressed", () => {
		mount();

		cy.getByData("ui-button").shouldNotHaveAttribute("aria-pressed");
	});

	it("A reactive button can be reset", () => {
		mount({ reactive: "true", iconEnd: "icon-chevron-right" });

		cy.getByData("ui-button").click();

		cy.getByData("ui-button-label").shouldNotBeVisible();
		cy.getByData("ui-button-icon-end").shouldNotBeVisible();
		cy.getByData("ui-button-loading").shouldBeVisible();

		cy.getComponent().then(component => {
			component.reset(); // Call the exposed method

			cy.getByData("ui-button-label").shouldBeVisible();
			cy.getByData("ui-button-icon-end").shouldBeVisible();
			cy.getByData("ui-button-loading").shouldNotBeVisible();
		});
	});
});
