import IconDensityRelaxed from "./icon-density-relaxed.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconDensityRelaxed, { props: defaultProps });

describe("icon-density-relaxed", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
