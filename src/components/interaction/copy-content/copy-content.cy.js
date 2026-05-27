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

			cy.window().then((window) => {
				return window.navigator.clipboard.readText().then((clipboardText) => {
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

	describe("Styling hooks", () => {
		it("Has data-component on the root element", () => {
			mount();

			cy.getByData("copy-content").shouldHaveAttribute("data-component", "copy-content");
		});

		it("Has data-part on the label", () => {
			mount();

			cy.getByData("copy-content-label").shouldHaveAttribute("data-part", "label");
		});

		it("Has data-copied when the copy succeeds", () => {
			const content = "Test content";

			mount({ props: { content } });

			cy.getByData("copy-content").click();
			cy.getByData("copy-content").shouldHaveAttribute("data-copied");
		});

		it("Does not have data-copied by default", () => {
			mount();

			cy.getByData("copy-content").shouldNotHaveAttribute("data-copied");
		});
	});
});
