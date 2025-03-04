import FormCheckboxGroup from "./form-checkbox-group.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { id: "id-abc", options: ["Pineapple", "Banana", "Coconut"] };
const defaultSlots = { default: "Best smoothie" };
const mount = createMount(FormCheckboxGroup, { props: defaultProps, slots: defaultSlots });

describe("form-checkbox-group", () => {
	it("A checkbox group is rendered", () => {
		mount();

		cy.getByData("form-checkbox-group").shouldBeVisible();

		cy.getByData("form-checkbox-group")
			.getByData("form-label")
			.shouldHaveCount(4);

		cy.getByData("form-label").eq(0).shouldHaveText("Best smoothie");
		cy.getByData("form-label").eq(1).shouldHaveText("Pineapple");
		cy.getByData("form-label").eq(2).shouldHaveText("Banana");
		cy.getByData("form-label").eq(3).shouldHaveText("Coconut");
	});

	describe("Supplementary information", () => {
		it("Help can be supplied", () => {
			mount({ slots: { help: "Help text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");

			cy.getByData("form-checkbox-group")
				.shouldHaveAttribute("aria-describedby", "id-abc-help");
		});

		it("An error can be supplied", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");

			cy.getByData("form-checkbox-group")
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

			cy.getByData("form-checkbox-group")
				.shouldHaveAttribute("aria-describedby", "id-abc-help id-abc-error");
		});
	});
});
