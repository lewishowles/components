import FormHelp from "./form-help.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Help text" };
const mount = createMount(FormHelp, { slots: defaultSlots });

describe("form-help", () => {
	it("Renders help", () => {
		mount();

		cy.getByData("form-help").shouldBeVisible();
	});
});
