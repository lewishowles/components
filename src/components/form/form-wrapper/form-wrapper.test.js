import { createMount } from "@lewishowles/testing/vue";
import { flushPromises } from "@vue/test-utils";
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

			test("should preserve an existing initial value", async () => {
				const wrapper = mount({ props: { modelValue: { username: "wall-e" } } });
				const vm = wrapper.vm;

				await vm.registerField({ name: "username", validateField: () => true });

				expect(vm.formData).toEqual({ username: "wall-e" });
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

			test("Does not call the submit handler if parent-owned field errors are present", async () => {
				const onSubmit = vi.fn();

				const wrapper = mount({
					props: {
						fieldErrors: {
							email: "Enter a different email address",
						},
						onSubmit,
					},
				});

				wrapper.vm.registerField({ name: "email", id: "email-id", validateField: () => true });

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

			test("should include parent-owned field errors in `errorSummary`", () => {
				const wrapper = mount({
					props: {
						fieldErrors: {
							email: "Enter a different email address",
							name: ["Enter your full name"],
						},
					},
				});

				const vm = wrapper.vm;

				vm.registerField({ name: "name", id: "name-id", validateField: () => true });
				vm.registerField({ name: "email", id: "email-id", validateField: () => true });

				expect(vm.errorSummary).toEqual([
					{ fieldName: "name", id: "name-id", message: "Enter your full name" },
					{ fieldName: "email", id: "email-id", message: "Enter a different email address" },
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

			test("Resets isSubmitting to false automatically after submit", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { onSubmit } });

				await wrapper.vm.handleFormSubmit();

				expect(wrapper.vm.isSubmitting).toBe(false);
			});
		});
	});

	describe("submitErrorsCallback", () => {
		describe("handleSubmitError", () => {
			test("Maps a rejected error to a registered field", () => {
				const wrapper = mount({
					props: { submitErrorsCallback: () => ({ email: "That email is taken" }) },
				});

				const vm = wrapper.vm;

				vm.registerField({ name: "email", id: "email-id", validateField: () => true });

				vm.handleSubmitError(new Error("Request failed"));

				expect(vm.errorSummary).toEqual([
					{ fieldName: "email", id: "email-id", message: "That email is taken" },
				]);
			});

			test("Normalises a list of messages for a field", () => {
				const wrapper = mount({
					props: { submitErrorsCallback: () => ({ name: ["Too short", "Required"] }) },
				});

				const vm = wrapper.vm;

				vm.registerField({ name: "name", id: "name-id", validateField: () => true });

				vm.handleSubmitError(new Error("Request failed"));

				expect(vm.errorSummary).toEqual([
					{ fieldName: "name", id: "name-id", message: "Too short" },
					{ fieldName: "name", id: "name-id", message: "Required" },
				]);
			});

			test("Surfaces errors for unknown fields as general errors", () => {
				const wrapper = mount({
					props: { submitErrorsCallback: () => ({ form: "Something went wrong" }) },
				});

				const vm = wrapper.vm;

				vm.handleSubmitError(new Error("Request failed"));

				expect(vm.generalSubmitErrors).toEqual(["Something went wrong"]);
				expect(vm.errorSummary).toEqual([]);
			});

			test("Re-throws when the adapter returns nothing mappable", async () => {
				const error = new Error("Server error");
				const wrapper = mount({ props: { submitErrorsCallback: () => null } });

				const vm = wrapper.vm;

				await expect(vm.handleSubmitError(error)).rejects.toThrow(error);
				expect(vm.generalSubmitErrors).toEqual([]);
			});

			test("Re-throws when no submitErrorsCallback is provided", async () => {
				const error = new Error("Server error");
				const wrapper = mount();

				await expect(wrapper.vm.handleSubmitError(error)).rejects.toThrow(error);
			});
		});

		describe("getFieldErrors", () => {
			test("Combines parent-owned and adapter errors", () => {
				const wrapper = mount({
					props: {
						fieldErrors: { email: "Parent error" },
						submitErrorsCallback: () => ({ email: "API error" }),
					},
				});

				const vm = wrapper.vm;

				vm.registerField({ name: "email", id: "email-id", validateField: () => true });
				vm.handleSubmitError(new Error("Request failed"));

				expect(vm.getFieldErrors("email")).toEqual(["Parent error", "API error"]);
			});
		});

		describe("Async submit", () => {
			test("Maps a rejected submit and resets the submitting state", async () => {
				const onSubmit = vi.fn(() => Promise.reject(new Error("Request failed")));

				const wrapper = mount({
					props: {
						onSubmit,
						submitErrorsCallback: () => ({ email: "That email is taken" }),
					},
				});

				const vm = wrapper.vm;

				vm.registerField({ name: "email", id: "email-id", validateField: () => true });

				await vm.handleFormSubmit();
				await flushPromises();

				expect(vm.errorSummary).toEqual([
					{ fieldName: "email", id: "email-id", message: "That email is taken" },
				]);
				expect(vm.isSubmitting).toBe(false);
			});

			test("Clears stale field errors on a new submit", async () => {
				const onSubmit = vi
					.fn()
					.mockReturnValueOnce(Promise.reject(new Error("Request failed")))
					.mockReturnValueOnce(Promise.resolve());

				const wrapper = mount({
					props: {
						onSubmit,
						submitErrorsCallback: () => ({ email: "That email is taken" }),
					},
				});

				const vm = wrapper.vm;

				vm.registerField({ name: "email", id: "email-id", validateField: () => true });

				await vm.handleFormSubmit();
				await flushPromises();

				expect(vm.errorSummary).toHaveLength(1);

				await vm.handleFormSubmit();

				expect(vm.errorSummary).toEqual([]);

				await flushPromises();
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
