import SearchableList from "./searchable-list.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const data = [{ name: "Dasher" }, { name: "Dancer" }, { name: "Prancer" }, { name: "Vixen" }, { name: "Comet" }, { name: "Cupid" }, { name: "Donner" }, { name: "Blitzen" }, { name: "Rudolph" }];
const defaultProps = { data, placeholder: "e.g. Dasher" };
const defaultSlots = { label: "Find your favourite reindeer", default: ({ items }) => h("ul", items.map(item => h("li", { "data-test": "searchable-list-demo-item" }, item.name)))  };
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
		cy.getByData("searchable-list-toolbar").shouldBeVisible();
		cy.getByData("searchable-list-no-results").shouldNotBeVisible();

		cy.get("ul").shouldBeVisible();
		cy.get("li").shouldHaveCount(9);
	});

	describe("Search", () => {
		it("Items can be searched", () => {
			mount();

			cy.getByData("searchable-list-toolbar").shouldHaveText("Showing 9");
			cy.getByData("searchable-list-demo-item").shouldHaveCount(9);

			cy.fillFormField("searchable-list-search", "Dasher");

			cy.getByData("searchable-list-toolbar").shouldHaveText("Showing 1 of 9");
			cy.getByData("searchable-list-demo-item").shouldHaveCount(1);
		});

		it("Search can be reset", () => {
			mount();

			cy.fillFormField("searchable-list-search", "Dancer");

			cy.getByData("searchable-list-toolbar").shouldHaveText("Showing 1 of 9");
			cy.getByData("searchable-list-demo-item").shouldHaveCount(1);

			cy.getByData("searchable-list-reset-search-button").click();

			cy.getByData("searchable-list-toolbar").shouldHaveText("Showing 9");
			cy.getByData("searchable-list-demo-item").shouldHaveCount(9);
		});

		it("Object properties can be excluded", () => {
			mount({
				data: [{ name: "Dasher", role: "Reindeer" }, { name: "Dancer", role: "Reindeer" }],
				exclude: ["role"],
			});

			cy.fillFormField("searchable-list-search", "reindeer");
			cy.getByData("searchable-list-demo-item").should("not.exist");
			cy.getByData("searchable-list-no-results").shouldBeVisible();
		});

		it("Object properties can be searched exclusively", () => {
			mount({
				data: [{ name: "Dasher", role: "Reindeer" }, { name: "Dancer", role: "Reindeer" }],
				include: ["name"],
			});

			cy.fillFormField("searchable-list-search", "reindeer");
			cy.getByData("searchable-list-demo-item").should("not.exist");
			cy.getByData("searchable-list-no-results").shouldBeVisible();
		});
	});
});
