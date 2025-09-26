import {{PASCAL_CASE_NAME}} from "./{{ICON_NAME}}.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { class: "stroke-blue-800" };
const mount = createMount({{PASCAL_CASE_NAME}}, { props: defaultProps });

describe("{{ICON_NAME}}", () => {
	it("Renders an icon", () => {
		mount();

		cy.get("svg").shouldBeVisible();
	});
});
