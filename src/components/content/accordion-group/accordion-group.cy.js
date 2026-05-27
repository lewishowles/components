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

	describe("accordion-panel accessibility", () => {
		it("Panel content has role=region when fewer than 7 panels are present", () => {
			mount();

			cy.getByData("accordion-panel")
				.eq(0)
				.within(() => {
					cy.getByData("accordion-panel-content").shouldHaveAttribute("role", "region");
				});
		});

		it("Panel content aria-labelledby matches the title span id", () => {
			mount();

			cy.getByData("accordion-panel")
				.eq(0)
				.within(() => {
					cy.get("span[id]")
						.invoke("attr", "id")
						.then((titleId) => {
							cy.getByData("accordion-panel-content").shouldHaveAttribute(
								"aria-labelledby",
								titleId,
							);
						});
				});
		});

		it('Trigger button has data-part="trigger"', () => {
			mount();

			cy.getByData("accordion-panel")
				.eq(0)
				.within(() => {
					cy.getByData("accordion-panel-button").shouldHaveAttribute("data-part", "trigger");
				});
		});

		it("Trigger button aria-labelledby matches the title span id", () => {
			mount();

			cy.getByData("accordion-panel")
				.eq(0)
				.within(() => {
					cy.get("span[id]")
						.invoke("attr", "id")
						.then((titleId) => {
							cy.getByData("accordion-panel-button").shouldHaveAttribute(
								"aria-labelledby",
								titleId,
							);
						});
				});
		});

		it("Panel syncs aria-expanded when beforematch fires on panel content", () => {
			mount();

			cy.getByData("accordion-panel")
				.eq(0)
				.within(() => {
					cy.getByData("accordion-panel-button").shouldHaveAttribute("aria-expanded", "false");

					cy.getByData("accordion-panel-content").trigger("beforematch", { force: true });

					cy.getByData("accordion-panel-button").shouldHaveAttribute("aria-expanded", "true");
				});
		});
	});

	describe("accordion-panel", () => {
		it("A panel can be opened", () => {
			mount();

			openSection(0);
		});

		it("A panel can be opened via keyboard", () => {
			mount();

			cy.getByData("accordion-panel")
				.eq(0)
				.then(($panel) => {
					cy.wrap($panel).getByData("accordion-panel-button").focus();
					cy.wrap($panel).getByData("accordion-panel-button").realPress("Enter");

					confirmSectionOpen(0);
				});
		});
	});

	describe("accordion-group", () => {
		it("Expand all and Collapse all buttons are rendered", () => {
			mount();

			cy.getByData("accordion-group-expand-button").shouldBeVisible();
			cy.getByData("accordion-group-collapse-button").shouldBeVisible();
		});

		it("Expand all is aria-disabled when all panels are open", () => {
			mount();

			cy.getByData("accordion-group-expand-button").click();

			confirmSectionOpen(0);
			confirmSectionOpen(1);
			confirmSectionOpen(2);

			cy.getByData("accordion-group-expand-button").shouldHaveAttribute("aria-disabled", "true");
		});

		it("Collapse all is aria-disabled when all panels are closed", () => {
			mount();

			cy.getByData("accordion-group-collapse-button").shouldHaveAttribute("aria-disabled", "true");
		});

		it("Expand all opens all panels", () => {
			mount();

			confirmSectionClosed(0);
			confirmSectionClosed(1);
			confirmSectionClosed(2);

			cy.getByData("accordion-group-expand-button").click();

			confirmSectionOpen(0);
			confirmSectionOpen(1);
			confirmSectionOpen(2);
		});

		it("Collapse all closes all panels", () => {
			mount();

			cy.getByData("accordion-group-expand-button").click();

			confirmSectionOpen(0);
			confirmSectionOpen(1);
			confirmSectionOpen(2);

			cy.getByData("accordion-group-collapse-button").click();

			confirmSectionClosed(0);
			confirmSectionClosed(1);
			confirmSectionClosed(2);
		});

		it("Closing one panel re-enables Expand all", () => {
			mount();

			cy.getByData("accordion-group-expand-button").click();

			confirmSectionOpen(0);
			confirmSectionOpen(1);
			confirmSectionOpen(2);

			cy.getByData("accordion-group-expand-button").shouldHaveAttribute("aria-disabled", "true");

			closeSection(1);

			cy.getByData("accordion-group-expand-button").shouldNotHaveAttribute("aria-disabled");
		});
	});

	describe("keyboard navigation", () => {
		it("ArrowDown moves focus to the next trigger", () => {
			mount();

			cy.getByData("accordion-panel-button").eq(0).focus();
			cy.realPress("ArrowDown");

			cy.getByData("accordion-panel-button").eq(1).should("have.focus");
		});

		it("ArrowDown wraps from the last trigger to the first", () => {
			mount();

			cy.getByData("accordion-panel-button").eq(2).focus();
			cy.realPress("ArrowDown");

			cy.getByData("accordion-panel-button").eq(0).should("have.focus");
		});

		it("ArrowUp moves focus to the previous trigger", () => {
			mount();

			cy.getByData("accordion-panel-button").eq(1).focus();
			cy.realPress("ArrowUp");

			cy.getByData("accordion-panel-button").eq(0).should("have.focus");
		});

		it("Home moves focus to the first trigger", () => {
			mount();

			cy.getByData("accordion-panel-button").eq(2).focus();
			cy.realPress("Home");

			cy.getByData("accordion-panel-button").eq(0).should("have.focus");
		});

		it("End moves focus to the last trigger", () => {
			mount();

			cy.getByData("accordion-panel-button").eq(0).focus();
			cy.realPress("End");

			cy.getByData("accordion-panel-button").eq(2).should("have.focus");
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
	return h(
		AccordionPanel,
		{},
		{
			title: () => title,
			introduction: () => introduction,
			default: () => h("p", content),
		},
	);
}

/**
 * Open an accordion panel by its zero-based index in the accordion, and
 * verify that it is open.
 *
 * @param  {number}  index
 *     The index of the panel to open.
 */
function openSection(index) {
	cy.getByData("accordion-panel")
		.eq(index)
		.then(($panel) => {
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
	cy.getByData("accordion-panel")
		.eq(index)
		.then(($panel) => {
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
	cy.getByData("accordion-panel")
		.eq(index)
		.then(($panel) => {
			cy.wrap($panel)
				.getByData("accordion-panel-button")
				.shouldHaveAttribute("aria-expanded", "true");
			cy.wrap($panel)
				.getByData("accordion-panel-content")
				.shouldBeVisible()
				.shouldNotHaveAttribute("hidden");
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
	cy.getByData("accordion-panel")
		.eq(index)
		.then(($panel) => {
			cy.wrap($panel)
				.getByData("accordion-panel-button")
				.shouldHaveAttribute("aria-expanded", "false");
			cy.wrap($panel).getByData("accordion-panel-content").shouldHaveAttribute("hidden");
		});
}
