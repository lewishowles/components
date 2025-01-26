import AppPagination from "./app-pagination.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { count: 100 };
const mount = createMount(AppPagination, { props: defaultProps });

describe("app-pagination", () => {
	afterEach(() => {
		// Reset the history after each test
		cy.window().then(window => {
			window.history.pushState({}, "", "/");
		});
	});

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

	it("The initial page can be set by a \"page\" URL parameter", () => {
		cy.window().then(window => {
			window.history.pushState({}, "", "/app-pagination?page=2");
		});

		mount();

		assertCurrentPage(2);
	});

	describe("First page", () => {
		it("The user should not be able to navigate to previous pages", () => {
			mount();

			cy.getByData("app-pagination-previous").shouldHaveAttribute("disabled");
			cy.getByData("app-pagination-next").shouldNotHaveAttribute("disabled");
			cy.getByData("app-pagination-summary").shouldHaveCount(1);

			assertCurrentPage("1");
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

			assertCurrentPage("5");
		});
	});

	describe("Last page", () => {
		it("The user should not be able to navigate to next pages", () => {
			mount();

			goToLastPage();

			cy.getByData("app-pagination-previous").shouldNotHaveAttribute("disabled");
			cy.getByData("app-pagination-next").shouldHaveAttribute("disabled");
			cy.getByData("app-pagination-summary").shouldHaveCount(1);

			assertCurrentPage("10");
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

			assertCurrentPage("1");

			cy.getByData("app-pagination-next").click();

			assertCurrentPage("2");

			cy.getByData("app-pagination-next").click();

			assertCurrentPage("3");

			cy.getByData("app-pagination-previous").click();

			assertCurrentPage("2");

			cy.getByData("app-pagination-previous").click();

			assertCurrentPage("1");

			cy.getByData("app-pagination-previous").shouldHaveAttribute("disabled");
		});
	});

	describe("Showing items display", () => {
		it("The correct items indicator is shown for the first page", () => {
			mount();

			cy.getByData("app-pagination-showing-items-label").shouldHaveText("Showing 1–10 of 100 items");
		});

		it("The correct items indicator is shown for a central page", () => {
			mount();

			goToMiddlePage();

			cy.getByData("app-pagination-showing-items-label").shouldHaveText("Showing 41–50 of 100 items");
		});

		it("The correct items indicator is shown for the last page", () => {
			mount();

			goToLastPage();

			cy.getByData("app-pagination-showing-items-label").shouldHaveText("Showing 91–100 of 100 items");
		});

		it("The showing items indicator can be overridden", () => {
			mount({ slots: { "showing-items-label": ({ first, last, total }) => `${first} to ${last} of ${total}` } });

			cy.getByData("app-pagination-showing-items-label").shouldHaveText("1 to 10 of 100");
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
function assertCurrentPage(number) {
	cy.get("button.bg-purple-800").shouldHaveText(number);
}
