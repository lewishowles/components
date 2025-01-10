import IconDensityCompact from "./icon-density-compact.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconDensityCompact, { props: defaultProps });

describe("icon-density-compact", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
