import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import SearchableListFixture from "./searchable-list.fixture.vue";
import SearchableListCustomSearchFixture from "./searchable-list-custom-search.fixture.vue";

const mountSearchableList = createMount(SearchableListFixture);
const mountWithCustomSearch = createMount(SearchableListCustomSearchFixture);

test.describe("searchable-list", () => {
	test("a component is rendered", async ({ mount, page }) => {
		await mountSearchableList(mount);

		await expect(page.getByTestId("searchable-list")).toBeVisible();
	});

	test("the appropriate elements are visible", async ({ mount, page }) => {
		await mountSearchableList(mount);

		await expect(page.getByTestId("searchable-list-search")).toBeVisible();
		await expect(page.getByTestId("searchable-list-results")).toBeVisible();
		await expect(page.getByTestId("searchable-list-toolbar")).toBeVisible();
		await expect(page.getByTestId("searchable-list-no-results")).not.toBeAttached();

		await expect(page.locator("ul")).toBeVisible();
		await expect(page.locator("li")).toHaveCount(9);
	});

	test.describe("search", () => {
		test("items can be searched", async ({ mount, page }) => {
			await mountSearchableList(mount);

			await expect(page.getByTestId("searchable-list-toolbar")).toContainText("Showing 9");
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(9);

			await getSearchInput(page).fill("Dasher");

			await expect(page.getByTestId("searchable-list-toolbar")).toContainText("Showing 1 of 9");
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(1);
		});

		test("search can be controlled with modelValue", async ({ mount, page }) => {
			await mountSearchableList(mount, { modelValue: "Dasher" });

			await expect(page.getByTestId("searchable-list-toolbar")).toContainText("Showing 1 of 9");
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(1);
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveText("Dasher");
		});

		test("search ignores surrounding whitespace", async ({ mount, page }) => {
			await mountSearchableList(mount);

			await getSearchInput(page).fill(" Dasher ");

			await expect(page.getByTestId("searchable-list-toolbar")).toContainText("Showing 1 of 9");
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(1);
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveText("Dasher");
		});

		test("searchable content can be mapped separately from displayed items", async ({
			mount,
			page,
		}) => {
			await mountWithCustomSearch(mount);

			await getSearchInput(page).fill("medical");

			await expect(page.getByTestId("searchable-list-toolbar")).toContainText("Showing 1 of 2");
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(1);
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveText("Beverly Crusher");
		});

		test("search can be reset", async ({ mount, page }) => {
			await mountSearchableList(mount);

			await getSearchInput(page).fill("Dancer");

			await expect(page.getByTestId("searchable-list-toolbar")).toContainText("Showing 1 of 9");
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(1);

			await page.getByTestId("searchable-list-reset-search-button").click();

			await expect(page.getByTestId("searchable-list-toolbar")).toContainText("Showing 9");
			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(9);
		});

		test("object properties can be excluded", async ({ mount, page }) => {
			await mountSearchableList(mount, {
				data: [
					{ name: "Dasher", role: "Reindeer" },
					{ name: "Dancer", role: "Reindeer" },
				],
				exclude: ["role"],
			});

			await getSearchInput(page).fill("reindeer");

			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(0);
			await expect(page.getByTestId("searchable-list-no-results")).toBeVisible();
			await expect(page.locator("ul")).toBeAttached();
		});

		test("object properties can be searched exclusively", async ({ mount, page }) => {
			await mountSearchableList(mount, {
				data: [
					{ name: "Dasher", role: "Reindeer" },
					{ name: "Dancer", role: "Reindeer" },
				],
				include: ["name"],
			});

			await getSearchInput(page).fill("reindeer");

			await expect(page.getByTestId("searchable-list-demo-item")).toHaveCount(0);
			await expect(page.getByTestId("searchable-list-no-results")).toBeVisible();
			await expect(page.locator("ul")).toBeAttached();
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountSearchableList(mount);

			await expect(page.getByTestId("searchable-list")).toHaveAttribute(
				"data-component",
				"searchable-list",
			);
		});
	});
});

function getSearchInput(page) {
	return page.getByTestId("searchable-list-search").locator("input");
}
