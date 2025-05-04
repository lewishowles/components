import CopyContent from "./copy-content.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(CopyContent);

describe("copy-content", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("copy-content").shouldBeVisible();
	});

	describe("Interaction", () => {
		it("copies content to clipboard and shows success message", () => {
			const content = "Test content";

			mount({ props: { content } });

			cy.getByData("copy-content").click();

			cy.window().then(window => {
				window.navigator.clipboard.readText().then((clipboardText) => {
					expect(clipboardText).to.equal(content);
				});
			});

			cy.getByData("copy-content-success").shouldBeVisible();
			cy.getByData("copy-content-label").shouldNotBeVisible();
		});

		it("shows error message when no content is provided", () => {
			mount({ props: { content: "" } });

			cy.getByData("copy-content").click();
			cy.getByData("copy-content-error").shouldBeVisible();
		});
	});
});
