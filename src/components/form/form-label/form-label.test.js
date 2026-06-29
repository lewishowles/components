import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import FormLabel from "./form-label.vue";

const defaultProps = { id: "id-abc" };
const mount = createMount(FormLabel, { props: defaultProps });

// Provide a minimal form-wrapper context so the optional indicator renders
// inside a form. Use an empty object — form-label only checks for presence.
const formWrapperContext = {};

const mountInForm = createMount(FormLabel, {
	props: defaultProps,
	global: { provide: { "form-wrapper": formWrapperContext } },
});

describe("form-label", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Render contracts", () => {
		test("shows the optional indicator when inside a form-wrapper and not required", () => {
			const wrapper = mountInForm();

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').exists()).toBe(true);
		});

		test("hides the optional indicator when outside a form-wrapper", () => {
			const wrapper = mount();

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').exists()).toBe(false);
		});

		test("hides the optional indicator when required", () => {
			const wrapper = mount({ props: { required: true } });

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').exists()).toBe(false);
		});

		test("hides the optional indicator when disabled", () => {
			const wrapper = mount({ props: { showOptionalIndicator: false } });

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').exists()).toBe(false);
		});

		test("renders the default optional indicator text", () => {
			const wrapper = mountInForm();

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').text()).toBe("(optional)");
		});

		test("renders custom optional indicator content when the slot is provided", () => {
			const wrapper = mountInForm({ slots: { "optional-indicator": "Optional" } });

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').text()).toBe("Optional");
		});
	});
});
