import IconArrowUp from "./icon-arrow-up.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconArrowUp, { props: defaultProps });

describe("icon-arrow-up", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});

