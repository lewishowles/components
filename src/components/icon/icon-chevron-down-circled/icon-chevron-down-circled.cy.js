import IconChevronDownCircled from "./icon-chevron-down-circled.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconChevronDownCircled, { props: defaultProps });

describe("icon-chevron-down-circled", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
