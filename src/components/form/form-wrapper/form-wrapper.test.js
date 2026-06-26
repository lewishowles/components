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

	describe("Props", () => {
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

			describe("fieldErrorsFor", () => {
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

					expect(vm.fieldErrorsFor("email")).toEqual(["Parent error", "API error"]);
				});

				test("Deduplicates identical messages from multiple sources", () => {
					const wrapper = mount({
						props: {
							fieldErrors: { email: "Already taken" },
							submitErrorsCallback: () => ({ email: "Already taken" }),
						},
					});

					const vm = wrapper.vm;

					vm.registerField({ name: "email", id: "email-id", validateField: () => true });
					vm.handleSubmitError(new Error("Request failed"));

					expect(vm.fieldErrorsFor("email")).toEqual(["Already taken"]);
				});

				test("Includes field-local validation errors", async () => {
					const wrapper = mount();
					const vm = wrapper.vm;

					vm.registerField({
						name: "email",
						id: "email-id",
						validateField: () => ["Enter your email"],
					});

					await vm.handleFormSubmit();

					expect(vm.fieldErrorsFor("email")).toEqual(["Enter your email"]);
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

				test("Clears all wrapper-owned errors on a new submit", async () => {
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
					expect(vm.fieldValidationErrors).toEqual({});
					expect(vm.submitErrors).toEqual({});
					expect(vm.formLevelErrors).toEqual({});

					await flushPromises();
				});
			});
		});

		describe("rules", () => {
			const rules = {
				confirmPassword: [{ rule: "same", field: "password", message: "Passwords must match" }],
			};

			test("Maps a failing form-level rule to its field in the error summary", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { rules, onSubmit } });
				const vm = wrapper.vm;

				vm.registerField({ name: "password", id: "password-id", validateField: () => true });
				vm.registerField({ name: "confirmPassword", id: "confirm-id", validateField: () => true });

				vm.updateFieldValue("password", "wall-e");
				vm.updateFieldValue("confirmPassword", "eve");

				await vm.handleFormSubmit();

				expect(vm.errorSummary).toEqual([
					{ fieldName: "confirmPassword", id: "confirm-id", message: "Passwords must match" },
				]);
				expect(onSubmit).not.toHaveBeenCalled();
			});

			test("Submits when form-level rules pass", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { rules, onSubmit } });
				const vm = wrapper.vm;

				vm.registerField({ name: "password", id: "password-id", validateField: () => true });
				vm.registerField({ name: "confirmPassword", id: "confirm-id", validateField: () => true });

				vm.updateFieldValue("password", "wall-e");
				vm.updateFieldValue("confirmPassword", "wall-e");

				await vm.handleFormSubmit();

				expect(onSubmit).toHaveBeenCalledWith({ password: "wall-e", confirmPassword: "wall-e" });
			});

			test("Runs field-local rules before form-level rules in the summary", async () => {
				const wrapper = mount({ props: { rules } });
				const vm = wrapper.vm;

				vm.registerField({
					name: "password",
					id: "password-id",
					validateField: () => ["Password required"],
				});
				vm.registerField({ name: "confirmPassword", id: "confirm-id", validateField: () => true });

				vm.updateFieldValue("confirmPassword", "eve");

				await vm.handleFormSubmit();

				expect(vm.errorSummary).toEqual([
					{ fieldName: "password", id: "password-id", message: "Password required" },
					{ fieldName: "confirmPassword", id: "confirm-id", message: "Passwords must match" },
				]);
			});

			test("Clears resolved form-level errors on resubmit", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { rules, onSubmit } });
				const vm = wrapper.vm;

				vm.registerField({ name: "password", id: "password-id", validateField: () => true });
				vm.registerField({ name: "confirmPassword", id: "confirm-id", validateField: () => true });

				vm.updateFieldValue("password", "wall-e");
				vm.updateFieldValue("confirmPassword", "eve");

				await vm.handleFormSubmit();

				expect(vm.errorSummary).toHaveLength(1);

				vm.updateFieldValue("confirmPassword", "wall-e");

				await vm.handleFormSubmit();

				expect(vm.errorSummary).toEqual([]);
				expect(onSubmit).toHaveBeenCalled();
			});

			test("Includes form-level errors in fieldErrorsFor so they display beside the field", async () => {
				const wrapper = mount({ props: { rules } });
				const vm = wrapper.vm;

				vm.registerField({ name: "password", id: "password-id", validateField: () => true });
				vm.registerField({ name: "confirmPassword", id: "confirm-id", validateField: () => true });

				vm.updateFieldValue("password", "wall-e");
				vm.updateFieldValue("confirmPassword", "eve");

				await vm.handleFormSubmit();

				expect(vm.fieldErrorsFor("confirmPassword")).toEqual(["Passwords must match"]);
			});

			test("Exposes fieldValidationErrors via defineExpose", async () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerField({
					name: "email",
					id: "email-id",
					validateField: () => ["Enter your email"],
				});

				await vm.handleFormSubmit();

				expect(vm.fieldValidationErrors).toEqual({ email: ["Enter your email"] });
			});
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
			test("should not populate errorSummary if validation succeeds", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerField({ name: "name", id: "name-id", validateField: () => true });
				vm.registerField({ name: "email", id: "email-id", validateField: () => true });

				vm.validateFields();

				expect(vm.errorSummary).toEqual([]);
				expect(vm.fieldValidationErrors).toEqual({});
			});

			test("should populate errorSummary if validation fails", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.registerField({ name: "name", id: "name-id", validateField: () => true });
				vm.registerField({ name: "email", id: "email-id", validateField: () => ["Error message"] });

				vm.validateFields();

				expect(vm.fieldValidationErrors).toEqual({ email: ["Error message"] });
				expect(vm.errorSummary).toEqual([
					{ fieldName: "email", id: "email-id", message: "Error message" },
				]);
			});

			test("should include parent-owned field errors in errorSummary", () => {
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

	describe("Expose", () => {
		test("exposes isSubmitting", () => {
			const wrapper = mount();

			expect(wrapper.vm.isSubmitting).toBe(false);
		});
	});
});
