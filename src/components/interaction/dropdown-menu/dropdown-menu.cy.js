import DropdownMenu from "./dropdown-menu.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { summary: "Summary label", default: "Details content" };
const mount = createMount(DropdownMenu, { slots: defaultSlots });

describe("dropdown-menu", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("summary-details").shouldBeVisible().shouldNotHaveAttribute("open");
		cy.getByData("summary-details-summary").shouldBeVisible();
	});

	describe("Interaction", () => {
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

		it("floating is enabled by default", () => {
			mount();

			cy.getByData("summary-details-summary").click();

			cy.getByData("summary-details-content").shouldBeVisible().shouldHaveClass("absolute");
		});

		it("closeWithClickOutside is enabled by default", () => {
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

		siblingElement.setAttribute("data-test", selector);
		siblingElement.innerText = content;

		body.append(siblingElement);
	});
}
