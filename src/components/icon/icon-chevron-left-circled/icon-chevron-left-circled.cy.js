import IconChevronLeftCircled from "./icon-chevron-left-circled.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconChevronLeftCircled, { props: defaultProps });

describe("icon-chevron-left-circled", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
