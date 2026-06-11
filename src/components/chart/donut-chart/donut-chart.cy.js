import DonutChart from "./donut-chart.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = {
	segments: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }],
	class: "size-40",
};

const mount = createMount(DonutChart, { props: defaultProps });

describe("donut-chart", () => {
	it("Renders a chart", () => {
		mount();

		cy.getByData("donut-chart").shouldBeVisible();
	});

	it("The correct number of segments appear", () => {
		mount({
			segments: [{ value: 5 }, { value: 4 }, { value: 3 }, { value: 2 }, { value: 1 }],
		});

		cy.getByData("donut-chart").shouldBeVisible();
		cy.getByData("donut-chart-segment").shouldHaveCount(5);
	});
});
