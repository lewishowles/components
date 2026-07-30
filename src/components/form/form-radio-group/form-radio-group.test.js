import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { h, nextTick } from "vue";
import FormRadioGroup from "./form-radio-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(FormRadioGroup, { props: defaultProps });
const deepMount = createDeepMount(FormRadioGroup, { props: defaultProps });

describe("form-radio-group", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	test("should pre-fill the internal model when provided an initial model value and name", () => {
		const wrapper = mount({
			props: { name: "flavour", modelValue: "chocolate" },
		});

		expect(wrapper.vm.internalModel).toEqual({ flavour: "chocolate" });
	});

	test("should update the internal model when provided a new model value", async () => {
		const wrapper = mount();
		const vm = wrapper.vm;
		const inputId = wrapper.findComponent({ name: "FormInputGroup" }).props("id");

		expect(vm.internalModel).toEqual({});

		vm.internalModel = { [inputId]: "" };

		await wrapper.setProps({ modelValue: "chocolate" });

		expect(vm.internalModel).toEqual({ [inputId]: "chocolate" });
	});

	test("should emit a new model value when the internal model updates", async () => {
		const wrapper = mount();
		const vm = wrapper.vm;

		vm.internalModel = { "field-name": "chocolate" };

		await nextTick();

		expect(wrapper.emitted()).toHaveProperty("update:modelValue");
		expect(wrapper.emitted("update:modelValue")[0][0]).toEqual("chocolate");
	});

	describe("Props", () => {
		describe("name", () => {
			test("passes name to the input group", () => {
				const wrapper = mount({ props: { name: "flavour" } });

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("name")).toBe("flavour");
			});
		});

		describe("required", () => {
			test("passes required to the input group", () => {
				const wrapper = mount({ props: { required: true } });

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("required")).toBe(true);
			});

			test("does not mark the input group as required by default", () => {
				const wrapper = mount();

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("required")).toBe(false);
			});

			test("marks the input group as required when form-wrapper cascades a required rule", () => {
				const wrapper = mount({
					props: { name: "flavour" },
					global: {
						provide: {
							"form-wrapper": { isFieldRequired: (name) => name === "flavour" },
						},
					},
				});

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("required")).toBe(true);
			});

			test("does not mark the input group as required when the form-wrapper cascade does not match", () => {
				const wrapper = mount({
					props: { name: "flavour" },
					global: {
						provide: {
							"form-wrapper": { isFieldRequired: (name) => name === "other-field" },
						},
					},
				});

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("required")).toBe(false);
			});

			test("the explicit prop overrides a form-wrapper cascade of false", () => {
				const wrapper = mount({
					props: { name: "flavour", required: true },
					global: {
						provide: {
							"form-wrapper": { isFieldRequired: () => false },
						},
					},
				});

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("required")).toBe(true);
			});
		});

		describe("variant", () => {
			test("passes the card variant to the input group", () => {
				const wrapper = mount({ props: { variant: "card" } });

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("variant")).toBe("card");
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
	});
});
