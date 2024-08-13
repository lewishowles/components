import IconLoading from "./icon-loading.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconLoading, { props: defaultProps });

describe("icon-loading", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
