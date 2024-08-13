import LinkTag from "./link-tag.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(LinkTag);

describe("link-tag", () => {
	it("renders", () => {
		mount();
	});
});
