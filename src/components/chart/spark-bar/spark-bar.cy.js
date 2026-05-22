import SparkBar from "./spark-bar.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { current: 81, max: 100 };
const mount = createMount(SparkBar, { props: defaultProps });

describe("spark-bar", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("spark-bar").shouldBeVisible();
	});

	it("The appropriate accessibility attributes are included", () => {
		mount({ min: 20, max: 40, current: 30 });

		cy.getByData("spark-bar")
			.shouldHaveAttribute("role", "meter")
			.shouldHaveAttribute("aria-valuenow", "30")
			.shouldHaveAttribute("aria-valuemin", "20")
			.shouldHaveAttribute("aria-valuemax", "40");
	});

	it("The default slot receives correct props", () => {
		mount({
			slots: {
				default: "{{ percentage }}%",
			},
		});

		cy.getByData("spark-bar-value").shouldHaveText("81%");
	});

	it("Respects custom classes", () => {
		mount({
			trackClasses: "h-2 bg-red-200",
			barClasses: "bg-red-800",
			valueClasses: "text-sm font-bold",
		});

		cy.getByData("spark-bar").shouldBeVisible();
	});
});
