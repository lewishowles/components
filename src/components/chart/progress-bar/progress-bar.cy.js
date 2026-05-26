import ProgressBar from "./progress-bar.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { current: 30 };
const defaultSlots = { default: "Progress bar" };
const mount = createMount(ProgressBar, { props: defaultProps, slots: defaultSlots });

describe("progress-bar", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("progress-bar").shouldBeVisible().shouldHaveAttribute("aria-labelledby");
		cy.getByData("progress-bar-label").shouldHaveClass("sr-only");
	});

	it("The appropriate accessibility attributes are included", () => {
		mount({ min: 10, max: 90, current: 28 });

		cy.getByData("progress-bar")
			.shouldHaveAttribute("role", "progressbar")
			.shouldHaveAttribute("aria-valuenow", "28")
			.shouldHaveAttribute("aria-valuemin", "10")
			.shouldHaveAttribute("aria-valuemax", "90")
			.shouldHaveAttribute("aria-valuetext", "23%")
			.shouldHaveAttribute("aria-labelledby");
	});

	it("A label can be shown", () => {
		mount({ showLabel: true });

		cy.getByData("progress-bar-label").shouldBeVisible();
	});

	it("The value can be shown", () => {
		mount({ showValue: true });

		cy.getByData("progress-bar-value").shouldBeVisible();
	});
});
