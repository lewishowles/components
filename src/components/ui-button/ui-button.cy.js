import UiButton from "./ui-button.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "button--primary" };
const defaultSlots = { default: "Button" };
const mount = createMount(UiButton, { props: defaultProps, slots: defaultSlots });

describe("ui-button", () => {
	it("renders", () => {
		mount();
	});
});
