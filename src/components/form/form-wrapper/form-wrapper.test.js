import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormWrapper from "./form-wrapper.vue";

const mount = createMount(FormWrapper);

describe("form-wrapper", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("registerField", () => {
			test("should initialise a field's value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.formData).toEqual({});

				vm.registerField("username");

				expect(vm.formData).toEqual({ username: null });
			});
		});

		describe("updateFieldValue", () => {
			test("should update a field's value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.formData).toEqual({});

				vm.updateFieldValue("username", "wall-e");

				expect(vm.formData).toEqual({ username: "wall-e" });
			});
		});
	});
});
