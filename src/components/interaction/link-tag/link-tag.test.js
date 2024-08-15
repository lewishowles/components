import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import LinkTag from "./link-tag.vue";

const defaultProps = { href: "https://howles.dev" };
const mount = createMount(LinkTag, { props: defaultProps });

/**
 * There currently aren't any tests of significance in this suite, because the
 * component is made up of helper functions, which are individually tested, and
 * Cypress covers changes in the output for the user.
 */
describe("link-tag", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
