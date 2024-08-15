import ConditionalWrapper from "./conditional-wrapper.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = { default: () => h("div", { "data-test": "wrapped-content" }, "Wrapped content") };
const mount = createMount(ConditionalWrapper, { slots: defaultSlots });

describe("conditional-wrapper", () => {
	it("A wrapper is rendered", () => {
		mount({ class: "bg-grey-50 p-4" });

		cy.get(".bg-grey-50").shouldBeVisible();
		cy.getByData("wrapped-content").shouldBeVisible();
	});

	it("A wrapper can be excluded rendered", () => {
		mount({ wrap: false, class: "bg-grey-50 p-4" });

		cy.get(".bg-grey-50").should("not.exist");
		cy.getByData("wrapped-content").shouldBeVisible();
	});
});
