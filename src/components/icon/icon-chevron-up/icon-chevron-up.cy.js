import IconChevronUp from "./icon-chevron-up.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconChevronUp, { props: defaultProps });

describe("icon-chevron-up", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
