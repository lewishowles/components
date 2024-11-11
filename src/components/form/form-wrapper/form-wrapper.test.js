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

				vm.registerField({ name: "username", validateField: () => true });

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

		describe("handleFormSubmit", () => {
			test("should emit if no form fields are present", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.handleFormSubmit();

				expect(wrapper.emitted("submit")[0]).toEqual([{}]);
			});

			test("should emit if no validation is present", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerField({ name: "name", validateField: () => true });

				vm.handleFormSubmit();

				expect(wrapper.emitted("submit")[0]).toEqual([{ name: null }]);
			});

			test("should not emit if validation fails for a field", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerField({ name: "name", validateField: () => true });
				vm.registerField({ name: "email", validateField: () => ["Error message"] });

				vm.handleFormSubmit();

				expect(wrapper.emitted("submit")).toBeUndefined();
			});
		});

		describe("validateFields", () => {
			test("should not populate `errorSummary` if validation succeeds", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerField({ name: "name", id: "name-id", validateField: () => true });
				vm.registerField({ name: "email", id: "email-id", validateField: () => true });

				vm.validateFields();

				expect(vm.errorSummary).toEqual([]);
			});

			test("should populate `errorSummary` if validation fails", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerField({ name: "name", id: "name-id", validateField: () => true });
				vm.registerField({ name: "email", id: "email-id", validateField: () => ["Error message"] });

				vm.validateFields();

				expect(vm.errorSummary).toEqual([{ fieldName: "email", id: "email-id", message: "Error message" }]);
			});
		});

		describe("emitSubmit", () => {
			test("should emit the current form value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.emitSubmit();

				expect(wrapper.emitted("submit")[0]).toEqual([{}]);

				vm.updateFieldValue("name", "my_name");
				vm.updateFieldValue("email", "my_email");

				expect(wrapper.emitted("submit")[0]).toEqual([
					{
						name: "my_name",
						email: "my_email",
					},
				]);
			});
		});
	});
});
