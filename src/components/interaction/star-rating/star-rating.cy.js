import StarRating from "./star-rating.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { id: "id-abc" };
const defaultSlots = { default: "Rate your experience" };
const mount = createMount(StarRating, { props: defaultProps, slots: defaultSlots });

describe("star-rating", () => {
	it("A star rating is rendered", () => {
		mount();

		cy.getByData("star-rating").shouldBeVisible();

		cy.getByData("star-rating")
			.getByData("form-label")
			.shouldHaveCount(6);

		cy.getByData("form-label").eq(0).shouldHaveText("Rate your experience");
		cy.getByData("form-label").eq(1).shouldHaveText("1");
		cy.getByData("form-label").eq(2).shouldHaveText("2");
		cy.getByData("form-label").eq(3).shouldHaveText("3");
		cy.getByData("form-label").eq(4).shouldHaveText("4");
		cy.getByData("form-label").eq(5).shouldHaveText("5");

		cy.getByData("star-rating-current-rating").should("not.exist");
		cy.getByData("form-input-group-introduction").should("not.exist");
		cy.getByData("form-help").should("not.exist");
		cy.getByData("form-error").should("not.exist");
	});

	describe("Supplementary information", () => {
		it("An introduction can be supplied", () => {
			mount({ slots: { introduction: "Introductory text" } });

			cy.getByData("form-input-group-introduction")
				.shouldBeVisible()
				.shouldHaveText("Introductory text");
		});

		it("A current rating can be provided", () => {
			mount({ slots: { "current-rating": "4.5/5 based on 600 reviews" } });

			cy.getByData("star-rating-current-rating")
				.shouldBeVisible()
				.shouldHaveText("4.5/5 based on 600 reviews");
		});

		it("Help can be supplied", () => {
			mount({ slots: { help: "Help text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");

			cy.getByData("star-rating")
				.shouldHaveAttribute("aria-describedby", "id-abc-help");
		});

		it("An error can be supplied", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");

			cy.getByData("star-rating")
				.shouldHaveAttribute("aria-describedby", "id-abc-error");
		});

		it("Both help and an error can be supplied", () => {
			mount({ slots: { help: "Help text", error: "Error text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");

			cy.getByData("star-rating")
				.shouldHaveAttribute("aria-describedby", "id-abc-help id-abc-error");
		});
	});
});
