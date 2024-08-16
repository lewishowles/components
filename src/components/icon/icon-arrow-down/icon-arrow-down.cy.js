import IconArrowDown from "./icon-arrow-down.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconArrowDown, { props: defaultProps });

describe("icon-arrow-down", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});

