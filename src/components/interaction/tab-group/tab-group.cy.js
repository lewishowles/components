import TabGroup from "./tab-group.vue";
import TabItem from "@/components/interaction/tab-item/tab-item.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = { default: [createTab({ label: "First tab", content: "First tab content" }), createTab({ label: "Second tab", content: "Second tab content" })] };
const mount = createMount(TabGroup, { slots: defaultSlots });

describe("tab-group", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("tab-group").shouldBeVisible();
		cy.getByData("tab-group-tab").shouldHaveCount(2);
	});

	describe("Interaction", () => {
		it("The active tab should be highlighted", () => {
			mount();

			cy.getByData("tab-group-tab").eq(0).shouldHaveAttribute("aria-selected", "true");
			cy.getByData("tab-group-tab").eq(1).shouldHaveAttribute("aria-selected", "false");
		});

		it("The active tab can be changed", () => {
			mount();

			cy.getByData("tab-group-tab").eq(0).shouldHaveAttribute("aria-selected", "true");
			cy.getByData("tab-group-tab").eq(1).shouldHaveAttribute("aria-selected", "false");

			cy.getByData("tab-group-tab").eq(1).click();

			cy.getByData("tab-group-tab").eq(0).shouldHaveAttribute("aria-selected", "false");
			cy.getByData("tab-group-tab").eq(1).shouldHaveAttribute("aria-selected", "true");
		});
	});
});

function createTab({ label, content }) {
	return h(TabItem, {}, {
		default: () => h("p", content),
		label: () => label,
	});
}
