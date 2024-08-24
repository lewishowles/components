import SummaryDetails from "./summary-details.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { summary: "Summary label", default: "Details content" };
const mount = createMount(SummaryDetails, { slots: defaultSlots });

describe("summary-details", () => {
	it("A summary is rendered", () => {
		mount();

		cy.getByData("summary-details").shouldBeVisible().shouldNotHaveAttribute("open");
		cy.getByData("summary-details-summary").shouldBeVisible();
	});

	describe("Details", () => {
		it("Details can be toggled", () => {
			mount();

			cy.getByData("summary-details-summary").click();
			cy.getByData("summary-details").shouldHaveAttribute("open");

			cy.getByData("summary-details-summary").click();
			cy.getByData("summary-details").shouldNotHaveAttribute("open");
		});

		it("Details can be opened by default", () => {
			mount({ open: true });

			cy.getByData("summary-details").shouldHaveAttribute("open");

			cy.getByData("summary-details-summary").click();
			cy.getByData("summary-details").shouldNotHaveAttribute("open");
		});

		it("Details can float", () => {
			mount({ floating: true });

			cy.getByData("summary-details-summary").click();

			cy.getByData("summary-details-content").shouldBeVisible().shouldHaveClass("absolute");
		});
	});

	describe("Icons", () => {
		it("An icon is shown", () => {
			mount();

			cy.getByData("summary-details-icon-start").should("not.exist");
			cy.getByData("summary-details-icon-end").shouldBeVisible();
		});

		it("An icon can be placed at the start", () => {
			mount({ iconStart: true });

			cy.getByData("summary-details-icon-start").shouldBeVisible();
			cy.getByData("summary-details-icon-end").should("not.exist");
		});

		it("The summary icon can be hidden", () => {
			mount({ includeIcon: false });

			cy.getByData("summary-details-icon-end").should("not.exist");
			cy.getByData("summary-details-icon-start").should("not.exist");
		});
	});
});
