import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { nextTick } from "vue";
import FormCheckboxGroup from "./form-checkbox-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(FormCheckboxGroup, { props: defaultProps });

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
	});
});
