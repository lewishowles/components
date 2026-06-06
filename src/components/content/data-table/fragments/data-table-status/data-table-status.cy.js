import DataTableStatus, { statusTypes } from "./data-table-status.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(DataTableStatus);

describe("data-table-status", () => {
	it("A status region is rendered", () => {
		mount({ type: statusTypes.SORT, sortColumn: "Title", ascending: true });

		cy.getByData("data-table-status").should("exist");
	});

	it("Announces the sort state", () => {
		mount({ type: statusTypes.SORT, sortColumn: "Title", ascending: true });

		cy.getByData("data-table-status").shouldHaveText("Sorted by Title ascending");
	});

	it("Announces search results", () => {
		mount({ type: statusTypes.SEARCH, resultCount: 2, query: "ald" });

		cy.getByData("data-table-status").shouldHaveText('Showing 2 results for "ald"');
	});

	it("Announces the selection state", () => {
		mount({ type: statusTypes.SELECTION, selectedCount: 1, totalCount: 5 });

		cy.getByData("data-table-status").shouldHaveText("1 of 5 rows selected");
	});

	it("Allows the sort announcement to be customised", () => {
		mount({
			props: { type: statusTypes.SORT, sortColumn: "Title", ascending: true },
			slots: { "sort-status": "Custom sort message" },
		});

		cy.getByData("data-table-status").shouldHaveText("Custom sort message");
	});
});
