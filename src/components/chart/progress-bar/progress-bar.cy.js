import ProgressBar from "./progress-bar.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { current: 30 };
const mount = createMount(ProgressBar, { props: defaultProps });

describe("progress-bar", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("progress-bar").shouldBeVisible();
		cy.getByData("progress-bar-label").should("not.exist");
	});

	it("The appropriate accessibility attributes are included", () => {
		mount({ min: 10, max: 90, current: 28 });

		cy.getByData("progress-bar")
			.shouldHaveAttribute("role", "progressbar")
			.shouldHaveAttribute("aria-label", "Loading…")
			.shouldHaveAttribute("aria-valuenow", "28")
			.shouldHaveAttribute("aria-valuemin", "10")
			.shouldHaveAttribute("aria-valuemax", "90")
			.shouldHaveAttribute("aria-valuetext", "23%");
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
