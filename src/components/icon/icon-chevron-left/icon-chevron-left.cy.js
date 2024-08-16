import IconChevronLeft from "./icon-chevron-left.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconChevronLeft, { props: defaultProps });

describe("icon-chevron-left", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
