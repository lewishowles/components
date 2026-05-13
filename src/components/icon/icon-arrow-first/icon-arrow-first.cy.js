import IconArrowFirst from "./icon-arrow-first.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconArrowFirst, { props: defaultProps });

describe("icon-arrow-first", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
