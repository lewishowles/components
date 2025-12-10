import DropdownMenuCheckbox from "./dropdown-menu-checkbox.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(DropdownMenuCheckbox);

describe("dropdown-menu-checkbox", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("dropdown-menu-checkbox").shouldBeVisible();
	});
});
