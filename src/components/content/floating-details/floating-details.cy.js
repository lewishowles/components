import FloatingDetails from "./floating-details.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = { summary: "Summary label", default: "Details content" };
const mount = createMount(FloatingDetails, { slots: defaultSlots });

describe("floating-details", () => {
	it("A summary is rendered", () => {
		mount();

		cy.getByData("floating-details").shouldBeVisible().shouldNotHaveAttribute("open");
		cy.getByData("floating-details-summary").shouldBeVisible();
	});

	describe("Details", () => {
		it("Details can be toggled", () => {
			mount();

			cy.getByData("floating-details-summary").click();
			cy.getByData("floating-details").shouldHaveAttribute("open");
			cy.getByData("floating-details-content").shouldBeVisible().shouldHaveClass("absolute");

			cy.getByData("floating-details-summary").click();
			cy.getByData("floating-details").shouldNotHaveAttribute("open");
		});

		it("Details can be opened by default", () => {
			mount({ open: true });

			cy.getByData("floating-details").shouldHaveAttribute("open");

			cy.getByData("floating-details-summary").click();
			cy.getByData("floating-details").shouldNotHaveAttribute("open");
		});
	});

	describe("Icons", () => {
		it("An icon is shown", () => {
			mount();

			cy.getByData("floating-details-icon-start").should("not.exist");
			cy.getByData("floating-details-icon-end").shouldBeVisible();
		});

		it("An icon can be placed at the start", () => {
			mount({ iconAtStart: true });

			cy.getByData("floating-details-icon-start").shouldBeVisible();
			cy.getByData("floating-details-icon-end").should("not.exist");
		});

		it("The summary icon can be hidden", () => {
			mount({ includeIcon: false });

			cy.getByData("floating-details-icon-end").should("not.exist");
			cy.getByData("floating-details-icon-start").should("not.exist");
		});
	});

	describe("Slot props", () => {
		it("The close slot prop dismisses the panel", () => {
			mount({
				slots: {
					summary: "Summary label",
					default: ({ close }) => h("button", { "data-test": "close-button", onClick: close }, "Close"),
				},
			});

			cy.getByData("floating-details-summary").click();
			cy.getByData("floating-details").shouldHaveAttribute("open");

			cy.getByData("close-button").click();
			cy.getByData("floating-details").shouldNotHaveAttribute("open");
		});
	});

	describe("Positioning", () => {
		it("Opens below the trigger by default", () => {
			mount();

			cy.getByData("floating-details-summary").click();
			cy.getByData("floating-details-content").should("have.class", "top-full");
		});

		it("Flips above when the trigger is near the bottom of the viewport", () => {
			mount();

			cy.getByData("floating-details").invoke("attr", "style", "position:fixed;bottom:0;left:0;");
			cy.getByData("floating-details-summary").click();
			cy.getByData("floating-details-content").should("have.class", "bottom-full");
		});
	});

	describe("Interaction", () => {
		describe("closeWithEscape", () => {
			it("true", () => {
				mount({ slots: { default: h("a", { "href": "#", "data-test": "focusable-content" }, "Focusable content") } });

				cy.getByData("floating-details-summary").click();

				cy.getByData("focusable-content").shouldBeVisible();
				cy.getByData("focusable-content").focus();

				cy.focused().shouldHaveAttribute("data-test", "focusable-content");

				cy.realPress("Escape");

				cy.focused().shouldHaveAttribute("data-test", "floating-details-summary");
			});

			it("false", () => {
				mount({ props: { closeWithEscape: false }, slots: { default: h("a", { "href": "#", "data-test": "focusable-content" }, "Focusable content") } });

				cy.getByData("floating-details-summary").click();

				cy.getByData("focusable-content").shouldBeVisible();
				cy.getByData("focusable-content").focus();

				cy.focused().shouldHaveAttribute("data-test", "focusable-content");

				cy.realPress("Escape");

				cy.focused().shouldHaveAttribute("data-test", "focusable-content");
			});
		});

		it("The menu can be closed by clicking outside", () => {
			mount();

			createSiblingElement("Click target", "click-target");

			cy.getByData("floating-details-summary").click();

			cy.getByData("floating-details").shouldHaveAttribute("open");

			cy.getByData("click-target").click();

			cy.getByData("floating-details").shouldNotHaveAttribute("open");

			cy.getByData("click-target").then(element => {
				element.remove();
			});
		});
	});
});

/**
 * Create an element beside the currently mounted component by adding it to the
 * body.
 *
 * @param  {string}  content
 *     The content of the element
 * @param  {string}  selector
 *     The `data-test` selector for the element
 */
function createSiblingElement(content, selector) {
	cy.get("body").then(body => {
		const siblingElement = document.createElement("div");

		siblingElement.setAttribute("class", "mt-20");
		siblingElement.setAttribute("data-test", selector);
		siblingElement.innerText = content;

		body.append(siblingElement);
	});
}
