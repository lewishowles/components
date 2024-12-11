import FormSupplementary from "./form-supplementary.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FormSupplementary);

describe("form-supplementary", () => {
	it("renders", () => {
		mount();
	});
});
