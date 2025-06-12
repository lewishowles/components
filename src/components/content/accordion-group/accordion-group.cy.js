import AccordionGroup from "./accordion-group.vue";
import AccordionPanel from "@/components/content/accordion-panel/accordion-panel.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = {
	default: [
		createPanel({ title: "First panel", content: "First panel content" }),
		createPanel({ title: "Second panel", content: "Second panel content" }),
		createPanel({ title: "Third panel", content: "Third panel content" }),
	],
};

const mount = createMount(AccordionGroup, { slots: defaultSlots });

describe("accordion-group", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("accordion-group").shouldBeVisible();
		cy.getByData("accordion-panel").shouldBeVisible().shouldHaveCount(3);
	});

	describe("accordion-panel", () => {
		it("A panel can be opened", () => {
			mount();

			openSection(0);
		});

		it("A panel can be opened via keyboard", () => {
			mount();

			cy.getByData("accordion-panel").eq(0).then($panel => {
				cy.wrap($panel).getByData("accordion-panel-button").focus();
				cy.wrap($panel).getByData("accordion-panel-button").realPress("Enter");

				confirmSectionOpen(0);
			});
		});
	});

	describe("accordion-group", () => {
		it("All sections can be opened", () => {
			mount();

			cy.getByData("accordion-group-button").shouldHaveAttribute("aria-expanded", "false");

			confirmSectionClosed(0);
			confirmSectionClosed(1);
			confirmSectionClosed(2);

			cy.getByData("accordion-group-button").click();

			cy.getByData("accordion-group-button").shouldHaveAttribute("aria-expanded", "true");

			confirmSectionOpen(0);
			confirmSectionOpen(1);
			confirmSectionOpen(2);
		});

		it("Closing one panel appropriately updates the all sections button", () => {
			mount();

			cy.getByData("accordion-group-button").click();

			cy.getByData("accordion-group-button").shouldHaveAttribute("aria-expanded", "true");

			closeSection(1);

			cy.getByData("accordion-group-button").shouldHaveAttribute("aria-expanded", "false");
		});
	});
});

/**
 * Simplify the process of creating a new accordion panel to test with.
 *
 * @param  {string}  options.title
 *     The title of the panel, to appear in the button.
 * @param  {string}  options.introduction
 *     The introduction for the panel, to appear in the button.
 * @param  {string}  options.content
 *     The content of the panel.
 */
function createPanel({ title, introduction, content }) {
	return h(AccordionPanel, {}, {
		title: () => title,
		introduction: () => introduction,
		default: () => h("p", content),
	});
}

/**
 * Open an accordion panel by its zero-based index in the accordion, and
 * verify that it is open.
 *
 * @param  {number}  index
 *     The index of the panel to open.
 */
function openSection(index) {
	cy.getByData("accordion-panel").eq(index).then($panel => {
		confirmSectionClosed(index);

		cy.wrap($panel).getByData("accordion-panel-button").click();

		confirmSectionOpen(index);
	});
}

/**
 * Close an accordion panel by its zero-based index in the accordion, and
 * verify that it is closed.
 *
 * @param  {number}  index
 *     The index of the panel to close.
 */
function closeSection(index) {
	cy.getByData("accordion-panel").eq(index).then($panel => {
		confirmSectionOpen(index);

		cy.wrap($panel).getByData("accordion-panel-button").click();

		confirmSectionClosed(index);
	});
}

/**
 * Ensure that an accordion panel is open, given its zero-based index in the
 * accordion.
 *
 * @param  {number}  index
 *     The index of the panel to verify.
 */
function confirmSectionOpen(index) {
	cy.getByData("accordion-panel").eq(index).then($panel => {
		cy.wrap($panel).getByData("accordion-panel-button").shouldHaveAttribute("aria-expanded", "true");
		cy.wrap($panel).getByData("accordion-panel-content").shouldBeVisible().shouldNotHaveAttribute("hidden");
	});
}

/**
 * Ensure that an accordion panel is closed, given its zero-based index in the
 * accordion.
 *
 * @param  {number}  index
 *     The index of the panel to verify.
 */
function confirmSectionClosed(index) {
	cy.getByData("accordion-panel").eq(index).then($panel => {
		cy.wrap($panel).getByData("accordion-panel-button").shouldHaveAttribute("aria-expanded", "false");
		cy.wrap($panel).getByData("accordion-panel-content").shouldHaveAttribute("hidden");
	});
}
