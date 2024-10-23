import SearchableList from "./searchable-list.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const data = [{ name: "Dasher" }, { name: "Dancer" }, { name: "Prancer" }, { name: "Vixen" }, { name: "Comet" }, { name: "Cupid" }, { name: "Donner" }, { name: "Blitzen" }, { name: "Rudolph" }];
const defaultProps = { data, placeholder: "e.g. Dasher" };
const defaultSlots = { label: "Find your favourite reindeer", default: ({ items }) => h("ul", items.map(item => h("li", item.name)))  };
const mount = createMount(SearchableList, { slots: defaultSlots, props: defaultProps });

describe("searchable-list", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("searchable-list").shouldBeVisible();
	});

	it("The appropriate elements are visible", () => {
		mount();

		cy.getByData("searchable-list-search").shouldBeVisible();
		cy.getByData("searchable-list-results").shouldBeVisible();

		cy.get("ul").shouldBeVisible();
		cy.get("li").shouldHaveCount(9);
	});
});
