import IconCheckCircled from "./icon-check-circled.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconCheckCircled, { props: defaultProps });

describe("icon-check-circled", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
