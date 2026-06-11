import ChartLegend from "./chart-legend.vue";
import { createMount } from "@cypress/support/mount";

const defaultSeries = [
	{ color: "var(--color-chart-1)", label: "Revenue", value: 42 },
	{ color: "var(--color-chart-2)", label: "Costs", value: 18 },
	{ color: "var(--color-chart-3)", label: "Profit", value: 24 },
];

const mount = createMount(ChartLegend, { props: { series: defaultSeries } });

describe("chart-legend", () => {
	it("Renders a legend", () => {
		mount();

		cy.getByData("chart-legend").shouldBeVisible();
	});

	it("Does not render when series is empty", () => {
		mount({ series: [] });

		cy.getByData("chart-legend").should("not.exist");
	});

	it("Renders the correct number of entries", () => {
		mount();

		cy.getByData("chart-legend-entry").shouldHaveCount(3);
	});

	it("Renders a label for each entry", () => {
		mount();

		cy.getByData("chart-legend-label").first().shouldHaveText("Revenue");
	});

	it("Renders a value for each entry by default", () => {
		mount();

		cy.getByData("chart-legend-value").shouldHaveCount(3);
	});

	it("Hides values when showValues is false", () => {
		mount({ showValues: false });

		cy.getByData("chart-legend-value").should("not.exist");
	});

	it("Formats values with the formatValue callback", () => {
		mount({ formatValue: (value) => `£${value}` });

		cy.getByData("chart-legend-value").first().shouldHaveText("£42");
	});
});
