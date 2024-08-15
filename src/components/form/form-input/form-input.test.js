import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormInput from "./form-input.vue";

const defaultProps = { id: "id-abc" };
const mount = createMount(FormInput, { props: defaultProps });

/**
 * There currently aren't any tests of significance in this suite, because the
 * component is made up of helper functions, which are individually tested, and
 * Cypress covers changes in the output for the user.
 */
describe("form-input", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
