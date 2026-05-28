import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vite-plus/test";
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
			test("Calls the submit handler if no form fields are present", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { onSubmit } });

				await wrapper.vm.handleFormSubmit();

				expect(onSubmit).toHaveBeenCalledWith({});
			});

			test("Calls the submit handler if no validation is present", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { onSubmit } });

				wrapper.vm.registerField({ name: "name", validateField: () => true });

				await wrapper.vm.handleFormSubmit();

				expect(onSubmit).toHaveBeenCalledWith({ name: null });
			});

			test("Does not call the submit handler if validation fails", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { onSubmit } });

				wrapper.vm.registerField({ name: "name", validateField: () => true });
				wrapper.vm.registerField({ name: "email", validateField: () => ["Error message"] });

				await wrapper.vm.handleFormSubmit();

				expect(onSubmit).not.toHaveBeenCalled();
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

				expect(vm.errorSummary).toEqual([
					{ fieldName: "email", id: "email-id", message: "Error message" },
				]);
			});
		});

		describe("doSubmit", () => {
			test("Calls the submit handler with current form data", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { onSubmit } });

				wrapper.vm.updateFieldValue("name", "wall-e");

				await wrapper.vm.handleFormSubmit();

				expect(onSubmit).toHaveBeenCalledWith({ name: "wall-e" });
			});
		});

		describe("resetSubmitButton", () => {
			test("Is exposed", () => {
				const wrapper = mount();

				expect(wrapper.vm.resetSubmitButton).toBeTypeOf("function");
			});

			test("Resets isSubmitting to false", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { onSubmit } });

				await wrapper.vm.handleFormSubmit();

				// isSubmitting is true after a non-Promise handler — the caller must
				// reset it manually.
				expect(wrapper.vm.isSubmitting).toBe(true);

				wrapper.vm.resetSubmitButton();

				expect(wrapper.vm.isSubmitting).toBe(false);
			});
		});
	});

	describe("Expose", () => {
		test("exposes isSubmitting", () => {
			const wrapper = mount();

			expect(wrapper.vm.isSubmitting).toBe(false);
		});
	});
});
