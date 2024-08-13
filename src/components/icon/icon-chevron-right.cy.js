import IconChevronRight from "./icon-chevron-right.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconChevronRight, { props: defaultProps });

describe("icon-chevron-right", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
