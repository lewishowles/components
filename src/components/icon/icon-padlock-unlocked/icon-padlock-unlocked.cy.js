import IconPadlockUnlocked from "./icon-padlock-unlocked.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount(IconPadlockUnlocked, { props: defaultProps });

describe("icon-padlock-unlocked", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
