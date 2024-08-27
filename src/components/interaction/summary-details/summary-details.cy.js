import SummaryDetails from "./summary-details.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = { summary: "Summary label", default: "Details content" };
const mount = createMount(SummaryDetails, { slots: defaultSlots });

describe("summary-details", () => {
	it("A summary is rendered", () => {
		mount();

		cy.getByData("summary-details").shouldBeVisible().shouldNotHaveAttribute("open");
		cy.getByData("summary-details-summary").shouldBeVisible();
	});

	describe("Details", () => {
		it("Details can be toggled", () => {
			mount();

			cy.getByData("summary-details-summary").click();
			cy.getByData("summary-details").shouldHaveAttribute("open");

			cy.getByData("summary-details-summary").click();
			cy.getByData("summary-details").shouldNotHaveAttribute("open");
		});

		it("Details can be opened by default", () => {
			mount({ open: true });

			cy.getByData("summary-details").shouldHaveAttribute("open");

			cy.getByData("summary-details-summary").click();
			cy.getByData("summary-details").shouldNotHaveAttribute("open");
		});

		it("Details can float", () => {
			mount({ floating: true });

			cy.getByData("summary-details-summary").click();

			cy.getByData("summary-details-content").shouldBeVisible().shouldHaveClass("absolute");
		});
	});

	describe("Icons", () => {
		it("An icon is shown", () => {
			mount();

			cy.getByData("summary-details-icon-start").should("not.exist");
			cy.getByData("summary-details-icon-end").shouldBeVisible();
		});

		it("An icon can be placed at the start", () => {
			mount({ iconStart: true });

			cy.getByData("summary-details-icon-start").shouldBeVisible();
			cy.getByData("summary-details-icon-end").should("not.exist");
		});

		it("The summary icon can be hidden", () => {
			mount({ includeIcon: false });

			cy.getByData("summary-details-icon-end").should("not.exist");
			cy.getByData("summary-details-icon-start").should("not.exist");
		});
	});

	describe("Interaction", () => {
		describe("closeWithEscape", () => {
			it("true", () => {
				mount({ slots: { default: h("a", { "href": "#", "data-test": "focusable-content" }, "Focusable content") } });

				cy.getByData("summary-details-summary").click();

				cy.getByData("focusable-content").shouldBeVisible();
				cy.getByData("focusable-content").focus();

				cy.focused().shouldHaveAttribute("data-test", "focusable-content");

				cy.realPress("Escape");

				cy.focused().shouldHaveAttribute("data-test", "summary-details-summary");
			});

			it("false", () => {
				mount({ props: { closeWithEscape: false }, slots: { default: h("a", { "href": "#", "data-test": "focusable-content" }, "Focusable content") } });

				cy.getByData("summary-details-summary").click();

				cy.getByData("focusable-content").shouldBeVisible();
				cy.getByData("focusable-content").focus();

				cy.focused().shouldHaveAttribute("data-test", "focusable-content");

				cy.realPress("Escape");

				cy.focused().shouldHaveAttribute("data-test", "focusable-content");
			});
		});

		describe("closeWithClickOutside", () => {
			it("true", () => {
				mount({ closeWithClickOutside: true });

				createSiblingElement("Click target", "click-target");

				cy.getByData("summary-details-summary").click();

				cy.getByData("summary-details").shouldHaveAttribute("open");

				cy.getByData("click-target").click();

				cy.getByData("summary-details").shouldNotHaveAttribute("open");

				cy.getByData("click-target").then(element => {
					element.remove();
				});
			});

			it("false", () => {
				mount({ closeWithClickOutside: false });

				createSiblingElement("Click target", "click-target");

				cy.getByData("summary-details-summary").click();

				cy.getByData("summary-details").shouldHaveAttribute("open");

				cy.getByData("click-target").click();

				cy.getByData("summary-details").shouldHaveAttribute("open");

				cy.getByData("click-target").then(element => {
					element.remove();
				});
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
	cy.get("body").then((body) => {
		const siblingElement = document.createElement("div");

		siblingElement.setAttribute("data-test", selector);
		siblingElement.innerText = content;

		body.append(siblingElement);
	});
}
