import DropdownMenuCheckbox from "./dropdown-menu-checkbox.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Checkbox label" };
const mount = createMount(DropdownMenuCheckbox, { slots: defaultSlots });

describe("dropdown-menu-checkbox", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("dropdown-menu-checkbox").shouldBeVisible();
	});
});
