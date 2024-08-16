import IconArrowRight from "./icon-arrow-right.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconArrowRight, { props: defaultProps });

describe("icon-arrow-right", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});

