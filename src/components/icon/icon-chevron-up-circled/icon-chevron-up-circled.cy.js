import IconChevronUpCircled from "./icon-chevron-up-circled.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconChevronUpCircled, { props: defaultProps });

describe("icon-chevron-up-circled", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
