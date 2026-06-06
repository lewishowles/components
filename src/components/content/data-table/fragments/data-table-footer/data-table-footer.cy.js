import { createMount } from "@cypress/support/mount";

import DataTableFooter from "./data-table-footer.vue";

const mount = createMount(DataTableFooter, { props: { totalCount: 25, haveDataToDisplay: true } });

describe("data-table-footer", () => {
	it("Shows pagination when there is data to display", () => {
		mount();

		cy.getByData("data-table-pagination").shouldBeVisible();
		cy.getByData("data-table-no-results").shouldNotBeVisible();
	});

	it("Shows the no-results message when there is no data to display", () => {
		mount({ props: { haveDataToDisplay: false, searchQuery: "zzz" } });

		cy.getByData("data-table-no-results").shouldBeVisible();
		cy.getByData("data-table-no-results").shouldHaveText('"zzz"');
		cy.getByData("data-table-pagination").shouldNotBeVisible();
	});

	it("Hides pagination when pagination is disabled", () => {
		mount({ props: { enablePagination: false } });

		cy.getByData("data-table-pagination").should("not.exist");
	});

	it("Shows the selected row count when selection is enabled", () => {
		mount({ props: { enableSelection: true, selectedCount: 4 } });

		cy.getByData("data-table-footer-selection").shouldHaveText("4 rows selected");
	});

	it("Allows the no-results message to be customised", () => {
		mount({ props: { haveDataToDisplay: false }, slots: { "no-results-message": "Nothing here" } });

		cy.getByData("data-table-no-results").shouldHaveText("Nothing here");
	});
});
