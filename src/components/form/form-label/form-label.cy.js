import FormLabel from "./form-label.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { id: "id-abc" };
const defaultSlots = { default: "Your name" };
const mount = createMount(FormLabel, { props: defaultProps, slots: defaultSlots });

describe("form-label", () => {
	it("A label is rendered", () => {
		mount();

		cy.getByData("form-label")
			.shouldBeVisible()
			.shouldHaveAttribute("for", "id-abc");
	});
});
