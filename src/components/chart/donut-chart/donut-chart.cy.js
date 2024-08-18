import DonutChart from "./donut-chart.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { values: [10, 20, 30, 40], class: "size-40" };
const mount = createMount(DonutChart, { props: defaultProps });

describe("donut-chart", () => {
	it("Renders a chart", () => {
		mount();

		cy.getByData("donut-chart").shouldBeVisible();
	});

	it("The correct number of segments appear", () => {
		mount({ values: [5, 4, 3, 2, 1] });

		cy.getByData("donut-chart").shouldBeVisible();
		cy.getByData("donut-chart-segment").shouldHaveCount(5);
	});
});
