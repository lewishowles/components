import StackingTest from "./test-fixtures/stacking-test.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(StackingTest);

describe("modal-controller", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("stacking-test-open-first").shouldBeVisible();
	});

	describe("Modal stacking", () => {
		it("The first modal is inert when a second modal opens on top", () => {
			mount();

			cy.getByData("stacking-test-open-first").click();
			cy.getByData("stacking-test-first-content").shouldBeVisible();

			cy.getByData("stacking-test-open-second").click();
			cy.getByData("stacking-test-second-content").shouldBeVisible();

			cy.getByData("stacking-test-first-content")
				.closest("dialog")
				.should("have.prop", "inert", true);
		});

		it("The first modal is no longer inert after the second modal closes", () => {
			mount();

			cy.getByData("stacking-test-open-first").click();
			cy.getByData("stacking-test-open-second").click();

			cy.getByData("stacking-test-close-second").click();

			cy.getByData("stacking-test-first-content")
				.closest("dialog")
				.should("have.prop", "inert", false);
		});

		it("Both modals remain in the DOM while stacked", () => {
			mount();

			cy.getByData("stacking-test-open-first").click();
			cy.getByData("stacking-test-open-second").click();

			cy.getByData("stacking-test-first-content").should("exist");
			cy.getByData("stacking-test-second-content").should("exist");
		});
	});
});
