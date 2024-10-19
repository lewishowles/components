import ImageTag from "./image-tag.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { src: "https://picsum.photos/300/300" };
const mount = createMount(ImageTag, { props: defaultProps });

describe("image-tag", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("image-tag").shouldBeVisible();
	});

	it("A fallback is rendered for an invalid image", () => {
		mount({ src: "/abcd" });

		cy.getByData("image-tag-fallback").shouldBeVisible();
	});
});
