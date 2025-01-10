import IconDensityStandard from "./icon-density-standard.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconDensityStandard, { props: defaultProps });

describe("icon-density-standard", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
