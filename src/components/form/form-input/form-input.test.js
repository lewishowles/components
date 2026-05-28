import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
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

	describe("Computed", () => {
		describe("haveSuggestions", () => {
			test("should be false when no suggestions are provided", () => {
				const wrapper = mount();

				expect(wrapper.vm.haveSuggestions).toBe(false);
			});

			test("should be false for an empty suggestions array", () => {
				const wrapper = mount({ props: { ...defaultProps, suggestions: [] } });

				expect(wrapper.vm.haveSuggestions).toBe(false);
			});

			test("should be true when suggestions are provided", () => {
				const wrapper = mount({
					props: { ...defaultProps, suggestions: ["Option A", "Option B"] },
				});

				expect(wrapper.vm.haveSuggestions).toBe(true);
			});
		});
	});
});
