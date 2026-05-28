import RelativeDate from "./relative-date.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = {
	date: "2025-03-29T13:14:50",
	locale: "en-GB",
	relativeTo: "2025-03-29T13:15:20",
};

const mount = createMount(RelativeDate, { props: defaultProps });

describe("relative-date", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("relative-date").shouldBeVisible();
	});

	it("A relative date is displayed", () => {
		mount();

		cy.getByData("relative-date").shouldHaveText("30 seconds ago");
	});

	it("A machine-readable datetime is provided", () => {
		mount();

		cy.getByData("relative-date").shouldHaveAttribute("datetime");
	});

	describe("Styling hooks", () => {
		it("data-component is set on the root element", () => {
			mount();

			cy.getByData("relative-date").shouldHaveAttribute("data-component", "relative-date");
		});
	});
});
