import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { h, nextTick } from "vue";
import FormCheckboxGroup from "./form-checkbox-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(FormCheckboxGroup, { props: defaultProps });
const deepMount = createDeepMount(FormCheckboxGroup, { props: defaultProps });

describe("form-checkbox-group", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	test("should update the internal model when provided a new model value", async () => {
		const wrapper = mount();
		const vm = wrapper.vm;

		expect(vm.internalModel).toEqual({});

		await wrapper.setProps({ modelValue: ["chocolate", "banana", "strawberry"] });

		expect(vm.internalModel).toEqual({ chocolate: true, banana: true, strawberry: true });
	});

	test("should initialise the internal model when provided an initial model value", () => {
		const wrapper = mount({
			props: { modelValue: ["banana", "coconut"] },
		});

		expect(wrapper.vm.internalModel).toEqual({ banana: true, coconut: true });
	});

	test("should emit a new model value when the internal model updates", async () => {
		const wrapper = mount();
		const vm = wrapper.vm;

		vm.internalModel = { chocolate: true, banana: true, strawberry: true };

		await nextTick();

		expect(wrapper.emitted()).toHaveProperty("update:modelValue");
		expect(wrapper.emitted("update:modelValue")[0][0]).toEqual([
			"chocolate",
			"banana",
			"strawberry",
		]);
	});

	describe("Props", () => {
		describe("required", () => {
			test("passes required to the input group", () => {
				const wrapper = mount({ props: { required: true } });

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("required")).toBe(true);
			});

			test("does not mark the input group as required by default", () => {
				const wrapper = mount();

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("required")).toBe(false);
			});
		});

		describe("variant", () => {
			test("passes the card variant to the input group", () => {
				const wrapper = mount({ props: { variant: "card" } });

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("variant")).toBe("card");
			});
		});

		describe("optionClasses", () => {
			test("passes custom option classes to the input group", () => {
				const optionClasses = { "rounded-lg": true };
				const wrapper = mount({ props: { optionClasses } });

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("optionClasses")).toEqual(
					optionClasses,
				);
			});
		});

		describe("optionsClasses", () => {
			test("passes custom options wrapper classes to the input group", () => {
				const optionsClasses = { "grid-cols-2": true };
				const wrapper = mount({ props: { optionsClasses } });

				expect(wrapper.findComponent({ name: "FormInputGroup" }).props("optionsClasses")).toEqual(
					optionsClasses,
				);
			});
		});

		describe("Slots", () => {
			test("forwards custom option content with selection details", () => {
				const wrapper = deepMount({
					props: { modelValue: ["banana"] },
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
