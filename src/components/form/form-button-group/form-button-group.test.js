import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { h } from "vue";
import ButtonGroup from "./form-button-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(ButtonGroup, { props: defaultProps });
const deepMount = createDeepMount(ButtonGroup, { props: defaultProps });

describe("form-button-group", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Props", () => {
		describe("required", () => {
			test("passes required to the radio group", () => {
				const wrapper = mount({ props: { required: true } });

				expect(wrapper.findComponent({ name: "FormRadioGroup" }).props("required")).toBe(true);
			});

			test("does not mark the radio group as required by default", () => {
				const wrapper = mount();

				expect(wrapper.findComponent({ name: "FormRadioGroup" }).props("required")).toBe(false);
			});
		});

		describe("displayLabel", () => {
			test("passes its default to the input group", () => {
				const wrapper = deepMount();

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("displayLabel")).toBe(true);
			});

			test("passes false to visually hide the group label", () => {
				const wrapper = deepMount({ props: { displayLabel: false } });

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("displayLabel")).toBe(false);
			});
		});

		describe("componentName", () => {
			test("uses its own root styling hooks", () => {
				const wrapper = deepMount();
				const fieldset = wrapper.find("fieldset");

				expect(fieldset.attributes("data-component")).toBe("form-button-group");
				expect(fieldset.attributes("data-test")).toBe("form-button-group");
			});
		});
	});

	describe("Slots", () => {
		test("forwards custom option content with selection details", () => {
			const wrapper = deepMount({
				props: { modelValue: "banana", name: "flavour" },
				slots: {
					option: ({ option, selected }) =>
						h("span", { "data-test": "custom-option" }, `${option.value}:${selected}`),
				},
			});

			const options = wrapper.findAll('[data-test="custom-option"]');

			expect(options).toHaveLength(3);
			expect(options[1].text()).toBe("banana:true");
		});
	});

	describe("Render", () => {
		test("renders option labels as indicator siblings", () => {
			const wrapper = deepMount();

			expect(wrapper.findAll('[data-part="indicator"] + [data-part="label"]')).toHaveLength(3);
		});
	});
});
