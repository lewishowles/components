import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import FormLabel from "./form-label.vue";

const defaultProps = { id: "id-abc" };

const mount = createMount(FormLabel, {
	props: defaultProps,
	slots: { default: "Label text" },
});

const deepMount = createDeepMount(FormLabel, {
	props: defaultProps,
	slots: { default: "Label text" },
});

// Provide a minimal form-wrapper context so the optional indicator renders
// inside a form. Use an empty object; form-label only checks for presence.
const formWrapperContext = {};

const mountInForm = createMount(FormLabel, {
	props: defaultProps,
	slots: { default: "Label text" },
	global: { provide: { form: formWrapperContext } },
});

describe("form-label", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Render", () => {
		test.each(["label", "legend"])("shows a warning without an empty %s", (tag) => {
			const wrapper = deepMount({
				props: { tag },
				slots: { default: "" },
				global: { provide: { form: formWrapperContext } },
			});

			expect(wrapper.find('[data-test="form-label-no-label"]').text()).toContain(
				"A label is required for accessibility purposes.",
			);
			expect(wrapper.find("label, legend").exists()).toBe(false);
			expect(wrapper.find('[data-test="form-label-optional-indicator"]').exists()).toBe(false);
		});

		test("associates label tags with their input", () => {
			const wrapper = deepMount();

			expect(wrapper.find("label").attributes("for")).toBe("id-abc");
			expect(wrapper.find("label").attributes("id")).toBeUndefined();
			expect(wrapper.find("label").text()).toBe("Label text");
			expect(wrapper.find('[data-test="form-label-no-label"]').exists()).toBe(false);
		});

		test("gives non-label tags their own ID", () => {
			const wrapper = deepMount({ props: { tag: "legend" } });

			expect(wrapper.find("legend").attributes("for")).toBeUndefined();
			expect(wrapper.find("legend").attributes("id")).toBe("id-abc");
			expect(wrapper.find("legend").text()).toBe("Label text");
		});

		test("shows the optional indicator when inside a form-wrapper and not required", () => {
			const wrapper = mountInForm();

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').exists()).toBe(true);
		});

		test("hides the optional indicator when outside a form-wrapper", () => {
			const wrapper = mount();

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').exists()).toBe(false);
		});

		test("hides the optional indicator when required", () => {
			const wrapper = mountInForm({ props: { required: true } });

			expect(wrapper.find('[data-test="form-label-optional-indicator"]').exists()).toBe(false);
		});

		test("hides the optional indicator when disabled", () => {
			const wrapper = mountInForm({ props: { showOptionalIndicator: false } });

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
