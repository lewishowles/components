import IconChevronDown from "./icon-chevron-down.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconChevronDown, { props: defaultProps });

describe("icon-chevron-down", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
