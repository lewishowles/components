import IconChevronRightCircled from "./icon-chevron-right-circled.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconChevronRightCircled, { props: defaultProps });

describe("icon-chevron-right-circled", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
