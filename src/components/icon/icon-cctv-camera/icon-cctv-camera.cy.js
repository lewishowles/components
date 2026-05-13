import IconCctvCamera from "./icon-cctv-camera.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconCctvCamera, { props: defaultProps });

describe("icon-cctv-camera", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
