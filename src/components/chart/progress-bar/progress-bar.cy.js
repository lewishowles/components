import ProgressBar from "./progress-bar.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { value: 30 };
const mount = createMount(ProgressBar, { props: defaultProps });

describe("progress-bar", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("progress-bar").shouldBeVisible();
	});

	it("The appropriate accessibility attributes are included", () => {
		mount({ min: 10, max: 90, value: 28 });

		cy.getByData("progress-bar")
			.shouldHaveAttribute("role", "progressbar")
			.shouldHaveAttribute("aria-label", "Loading…")
			.shouldHaveAttribute("aria-valuenow", "28")
			.shouldHaveAttribute("aria-valuemin", "10")
			.shouldHaveAttribute("aria-valuemax", "90")
			.shouldHaveAttribute("aria-valuetext", "20%");
	});
});
