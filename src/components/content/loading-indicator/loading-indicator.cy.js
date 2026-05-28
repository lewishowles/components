import LoadingIndicator from "./loading-indicator.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Loading" };
const mount = createMount(LoadingIndicator, { slots: defaultSlots });

describe("loading-indicator", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("loading-indicator").shouldBeVisible();
		cy.getByData("loading-indicator").shouldHaveText("Loading");
	});

	describe("Styling hooks", () => {
		it("data-component is set on the root element", () => {
			mount();

			cy.getByData("loading-indicator").shouldHaveAttribute("data-component", "loading-indicator");
		});

		it("data-large is set when large is true", () => {
			mount({ large: true });

			cy.getByData("loading-indicator").shouldHaveAttribute("data-large");
		});

		it("data-large is not set by default", () => {
			mount();

			cy.getByData("loading-indicator").shouldNotHaveAttribute("data-large");
		});
	});
});
