import AccordionGroup from "./accordion-group.vue";
import AccordionSection from "@/components/content/accordion-section/accordion-section.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = {
	default: [
		createSection({ title: "First section", content: "First section content" }),
		createSection({ title: "Second section", content: "Second section content" }),
		createSection({ title: "Third section", content: "Third section content" }),
	],
};

const mount = createMount(AccordionGroup, { slots: defaultSlots });

describe("accordion-group", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("accordion-group").shouldBeVisible();
		cy.getByData("accordion-section").shouldBeVisible().shouldHaveCount(3);
	});

	describe("accordion-section", () => {
		it("A section can be opened", () => {
			mount();

			openSection(0);
		});

		it("A section can be opened via keyboard", () => {
			mount();

			cy.getByData("accordion-section").eq(0).then($section => {
				cy.wrap($section).getByData("accordion-section-button").focus();
				cy.wrap($section).getByData("accordion-section-button").realPress("Enter");

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

		it("Closing one section appropriately updates the all sections button", () => {
			mount();

			cy.getByData("accordion-group-button").click();

			cy.getByData("accordion-group-button").shouldHaveAttribute("aria-expanded", "true");

			closeSection(1);

			cy.getByData("accordion-group-button").shouldHaveAttribute("aria-expanded", "false");
		});
	});
});

/**
 * Simplify the process of creating a new accordion section to test with.
 *
 * @param  {string}  options.title
 *     The title of the section, to appear in the button.
 * @param  {string}  options.introduction
 *     The introduction for the section, to appear in the button.
 * @param  {string}  options.content
 *     The content of the section.
 */
function createSection({ title, introduction, content }) {
	return h(AccordionSection, {}, {
		title: () => title,
		introduction: () => introduction,
		default: () => h("p", content),
	});
}

/**
 * Open an accordion section by its zero-based index in the accordion, and
 * verify that it is open.
 *
 * @param  {number}  index
 *     The index of the section to open.
 */
function openSection(index) {
	cy.getByData("accordion-section").eq(index).then($section => {
		confirmSectionClosed(index);

		cy.wrap($section).getByData("accordion-section-button").click();

		confirmSectionOpen(index);
	});
}

/**
 * Close an accordion section by its zero-based index in the accordion, and
 * verify that it is closed.
 *
 * @param  {number}  index
 *     The index of the section to close.
 */
function closeSection(index) {
	cy.getByData("accordion-section").eq(index).then($section => {
		confirmSectionOpen(index);

		cy.wrap($section).getByData("accordion-section-button").click();

		confirmSectionClosed(index);
	});
}

/**
 * Ensure that an accordion section is open, given its zero-based index in the
 * accordion.
 *
 * @param  {number}  index
 *     The index of the section to verify.
 */
function confirmSectionOpen(index) {
	cy.getByData("accordion-section").eq(index).then($section => {
		cy.wrap($section).getByData("accordion-section-button").shouldHaveAttribute("aria-expanded", "true");
		cy.wrap($section).getByData("accordion-section-content").shouldBeVisible();
	});
}

/**
 * Ensure that an accordion section is closed, given its zero-based index in the
 * accordion.
 *
 * @param  {number}  index
 *     The index of the section to verify.
 */
function confirmSectionClosed(index) {
	cy.getByData("accordion-section").eq(index).then($section => {
		cy.wrap($section).getByData("accordion-section-button").shouldHaveAttribute("aria-expanded", "false");
		cy.wrap($section).getByData("accordion-section-content").shouldNotBeVisible();
	});
}
