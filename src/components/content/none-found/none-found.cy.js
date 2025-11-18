import NoneFound from "./none-found.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(NoneFound);

describe("none-found", () => {
	it("A component is rendered", () => {
		mount({
			slots: {
				title: "No users found",
				default: "No users were added in the last 7 days.",
			},
		});

		cy.getByData("none-found").shouldBeVisible();
		cy.getByData("none-found-title").shouldBeVisible();
	});

	describe("Render", () => {
		describe("Actions", () => {
			it("Actions should not be visible by default", () => {
				mount({
					slots: {
						title: "No users found",
						default: "No users were added in the last 7 days.",
					},
				});

				cy.getByData("none-found-actions").should("not.exist");
			});

			it("Actions should be visible when provided", () => {
				mount({
					slots: {
						title: "No users found",
						default: "No users were added in the last 7 days.",
						actions: "Actions",
					},
				});

				cy.getByData("none-found-actions").shouldBeVisible();
			});
		});
	});
});
