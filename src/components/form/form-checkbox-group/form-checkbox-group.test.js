import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
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

	test("should update the internal model when provided a new model value", async() => {
		const wrapper = mount();
		const vm = wrapper.vm;

		expect(vm.internalModel).toEqual({});

		await wrapper.setProps({ modelValue: ["chocolate", "banana", "strawberry"] });

		expect(vm.internalModel).toEqual({ chocolate: true, banana: true, strawberry: true });
	});

	test("should emit a new model value when the internal model updates", async() => {
		const wrapper = mount();
		const vm = wrapper.vm;

		vm.internalModel = { chocolate: true, banana: true, strawberry: true };

		await nextTick();

		expect(wrapper.emitted()).toHaveProperty("update:modelValue");
		expect(wrapper.emitted("update:modelValue")[0][0]).toEqual(["chocolate", "banana", "strawberry"]);
	});
});
