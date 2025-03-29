import DisplayDate from "./display-date.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { date: "2025-03-29" };
const mount = createMount(DisplayDate, { props: defaultProps });

describe("display-date", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("display-date").shouldBeVisible();
	});

	describe("Formatting", () => {
		it("Default formatting is applied", () => {
			mount();

			cy.getByData("display-date").shouldHaveText("29/03/2025");
		});
	});
});
