import DataTable from "./data-table.vue";
import { createMount } from "@cypress/support/mount";

const data = [
	{
		id: "da9eff2a-c10e-42a3-ab3f-9f252c574384",
		title: "Frozen",
		release_year: "2013",
		box_office: "1,290.0",
	},
	{
		id: "3ffd9ae1-ef4f-4f6e-b408-a2c5b58a3305",
		title: "The Lion King",
		release_year: "1994",
		box_office: "968.5",
	},
	{
		id: "2e644b4b-51e8-4519-ab31-d9a37e2d0434",
		title: "Toy Story",
		release_year: "1995",
		box_office: "373.6",
	},
];

const defaultProps = { data };
const mount = createMount(DataTable, { props: defaultProps });

describe("data-table", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("data-table").shouldBeVisible();
	});

	it("A message is displayed if no data is available", () => {
		mount({ data: [] });

		cy.getByData("data-table-no-data").shouldBeVisible();
	});

	it("The appropriate table is rendered when provided with data", () => {
		mount();

		cy.getByData("data-table-table").shouldBeVisible();
		cy.getByData("data-table-heading").shouldHaveCount(4);
		cy.getByData("data-table-row").shouldHaveCount(3);
		cy.getByData("data-table-cell").shouldHaveCount(12);
	});

	describe("Column configuration", () => {
		it("Columns can be given labels", () => {
			mount({
				columns: {
					release_year: { label: "Release year" },
					box_office: { label: "Box office ($m)" },
				},
			});

			cy.getByData("data-table-heading").eq(0).shouldHaveText("id");
			cy.getByData("data-table-heading").eq(1).shouldHaveText("title");
			cy.getByData("data-table-heading").eq(2).shouldHaveText("Release year");
			cy.getByData("data-table-heading").eq(3).shouldHaveText("Box office ($m)");
		});
	});
});
