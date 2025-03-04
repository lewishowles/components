import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import { nextTick } from "vue";
import FormRadioGroup from "./form-radio-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(FormRadioGroup, { props: defaultProps });

describe("form-radio-group", () => {
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

		vm.internalModel = { "field-name": "" };

		await wrapper.setProps({ modelValue: "chocolate" });

		expect(vm.internalModel).toEqual({ "field-name": "chocolate" });
	});

	test("should emit a new model value when the internal model updates", async() => {
		const wrapper = mount();
		const vm = wrapper.vm;

		vm.internalModel = { "field-name": "chocolate" };

		await nextTick();

		expect(wrapper.emitted()).toHaveProperty("update:modelValue");
		expect(wrapper.emitted("update:modelValue")[0][0]).toEqual("chocolate");
	});
});
