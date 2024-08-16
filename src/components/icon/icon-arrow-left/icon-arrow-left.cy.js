import IconArrowLeft from "./icon-arrow-left.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconArrowLeft, { props: defaultProps });

describe("icon-arrow-left", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});

