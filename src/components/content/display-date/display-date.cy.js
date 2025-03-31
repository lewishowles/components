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

		it("A time-zoned date is formatted", () => {
			mount({ date: "2025-03-29[America/New_York]" });

			cy.getByData("display-date").shouldHaveText("29/03/2025, 0:00:00 GMT-4");
		});

		it("A date with a time component is formatted", () => {
			mount({ date: "2025-03-29T13:15:20" });

			cy.getByData("display-date").shouldHaveText("29/03/2025, 13:15:20");
		});

		it("A custom locale can be provided", () => {
			mount({ locale: "de-DE" });

			cy.getByData("display-date").shouldHaveText("29.3.2025");
		});
	});
});
