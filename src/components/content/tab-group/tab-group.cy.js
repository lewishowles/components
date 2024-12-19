import TabGroup from "./tab-group.vue";
import TabItem from "@/components/content/tab-item/tab-item.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = {
	default: [
		createTab({ label: "First tab", content: "First tab content" }),
		createTab({ label: "Second tab", content: "Second tab content" }),
		createTab({ label: "Third tab", content: "Third tab content" }),
	],
};

const mount = createMount(TabGroup, { slots: defaultSlots });

describe("tab-group", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("tab-group").shouldBeVisible();
		cy.getByData("tab-group-tab").shouldHaveCount(3);
	});

	describe("Interaction", () => {
		it("The active tab should be highlighted", () => {
			mount();

			assertActiveTab(0);
		});

		it("The active tab can be changed", () => {
			mount();

			assertActiveTab(0);

			cy.getByData("tab-group-tab").eq(1).click();

			assertActiveTab(1);
		});

		it("Keyboard navigation can be utilised", () => {
			mount();

			assertActiveTab(0);

			cy.getByData("tab-group-tab").eq(0).click();

			cy.realPress("ArrowRight");

			assertActiveTab(1);
			assertFocusedTab(1);

			cy.realPress("ArrowRight");

			assertActiveTab(2);
			assertFocusedTab(2);

			cy.realPress("ArrowLeft");

			assertActiveTab(1);
			assertFocusedTab(1);

			cy.realPress("ArrowDown");

			assertActiveTab(2);
			assertFocusedTab(2);

			cy.realPress("ArrowDown");

			assertActiveTab(0);
			assertFocusedTab(0);

			cy.realPress("ArrowUp");

			assertActiveTab(2);
			assertFocusedTab(2);
		});
	});
});

/**
 * Simplify the process of creating a new tab to test with.
 *
 * @param  {string}  options.label
 *     The label of the tab, to appear in the tab bar.
 * @param  {string}  options.content
 *     The content of the tab panel.
 */
function createTab({ label, content }) {
	return h(TabItem, {}, {
		default: () => h("p", content),
		label: () => label,
	});
}

/**
 * Ensure that the tab at the given index is active, as marked by its
 * aria-selected attribute, and that all other tabs, as defined by the tab
 * count, are not active.
 *
 * @param  {number}  index
 *     The index of the tab to check.
 * @param  {number}  tabCount
 *     The number of tabs in this series.
 */
function assertActiveTab(index, tabCount = 3) {
	for (let i = 0; i < tabCount; i++) {
		if (i === index) {
			cy.getByData("tab-group-tab").eq(i).shouldHaveAttribute("aria-selected", "true");
		} else {
			cy.getByData("tab-group-tab").eq(i).shouldHaveAttribute("aria-selected", "false");
		}
	}
}

/**
 * Ensure the tab at the given index has focus.
 *
 * @param  {number}  index
 *     The index of the tab to test.
 */
function assertFocusedTab(index) {
	cy.getByData("tab-group-tab").eq(index).shouldHaveFocus();
}
