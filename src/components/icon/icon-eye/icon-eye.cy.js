import IconEye from "./icon-eye.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconEye, { props: defaultProps });

describe("icon-eye", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
