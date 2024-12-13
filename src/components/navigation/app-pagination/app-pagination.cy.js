import AppPagination from "./app-pagination.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { count: 100 };
const mount = createMount(AppPagination, { props: defaultProps });

describe("app-pagination", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("app-pagination").shouldBeVisible();
	});

	it("The appropriate elements are visible", () => {
		mount();

		cy.getByData("app-pagination-previous").shouldBeVisible();
		cy.getByData("app-pagination-next").shouldBeVisible();
		cy.getByData("app-pagination-page").shouldBeVisible();
	});

	it("No pagination should show when there is only one page", () => {
		mount({ count: 10 });

		cy.getByData("app-pagination").should("not.exist");
	});

	describe("First page", () => {
		it("The user should not be able to navigate to previous pages", () => {
			mount();

			cy.getByData("app-pagination-previous").shouldHaveAttribute("disabled");
			cy.getByData("app-pagination-next").shouldNotHaveAttribute("disabled");
			cy.getByData("app-pagination-summary").shouldHaveCount(1);

			checkHighlightedPage("1");
		});

		it("The correct number of pages should appear for 100 items", () => {
			mount();

			cy.getByData("app-pagination-page").shouldHaveCount(4);
			cy.getByData("app-pagination-summary").shouldHaveCount(1);
		});

		it("The correct number of pages should appear for 30 items", () => {
			mount({ count: 30 });

			cy.getByData("app-pagination-page").shouldHaveCount(3);
		});
	});

	describe("Middle page", () => {
		it("The user should be able to navigate in either direction", () => {
			mount();

			goToMiddlePage();

			cy.getByData("app-pagination-previous").shouldNotHaveAttribute("disabled");
			cy.getByData("app-pagination-next").shouldNotHaveAttribute("disabled");
			cy.getByData("app-pagination-summary").shouldHaveCount(2);
			cy.getByData("app-pagination-page").shouldHaveCount(5);

			checkHighlightedPage("5");
		});
	});

	describe("Last page", () => {
		it("The user should not be able to navigate to next pages", () => {
			mount();

			goToLastPage();

			cy.getByData("app-pagination-previous").shouldNotHaveAttribute("disabled");
			cy.getByData("app-pagination-next").shouldHaveAttribute("disabled");
			cy.getByData("app-pagination-summary").shouldHaveCount(1);

			checkHighlightedPage("10");
		});

		it("The correct number of pages should appear for 100 items", () => {
			mount();

			goToLastPage();

			cy.getByData("app-pagination-page").shouldHaveCount(4);
		});
	});

	describe("Navigation", () => {
		it("The user should be able to navigate between pages", () => {
			mount();

			checkHighlightedPage("1");

			cy.getByData("app-pagination-next").click();

			checkHighlightedPage("2");

			cy.getByData("app-pagination-next").click();

			checkHighlightedPage("3");

			cy.getByData("app-pagination-previous").click();

			checkHighlightedPage("2");

			cy.getByData("app-pagination-previous").click();

			checkHighlightedPage("1");

			cy.getByData("app-pagination-previous").shouldHaveAttribute("disabled");
		});
	});
});

// A simple method to jump to the middle of a pagination element.
function goToMiddlePage() {
	cy.getByData("app-pagination-next").click();
	cy.getByData("app-pagination-next").click();
	cy.getByData("app-pagination-next").click();
	cy.getByData("app-pagination-next").click();
}

// Navigate to the last page in the pagination, whatever that may be.
function goToLastPage() {
	cy.getByData("app-pagination-page").last().click();
}

// Find the page that is highlighted (and thus the current page), and check that
// it contains the correct number.
function checkHighlightedPage(number) {
	cy.get("button.bg-purple-800").shouldHaveText(number);
}
