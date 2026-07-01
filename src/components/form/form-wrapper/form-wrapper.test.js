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

					vm.registerField({ name: "email", id: "email-id" });

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

					vm.registerField({ name: "email", id: "email-id" });

					await vm.handleFormSubmit();
					await flushPromises();

					expect(vm.errorSummary).toHaveLength(1);

					await vm.handleFormSubmit();

					expect(vm.errorSummary).toEqual([]);

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

				vm.registerField({ name: "password", id: "password-id" });
				vm.registerField({ name: "confirmPassword", id: "confirm-id" });

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

				vm.registerField({ name: "password", id: "password-id" });
				vm.registerField({ name: "confirmPassword", id: "confirm-id" });

				vm.updateFieldValue("password", "wall-e");
				vm.updateFieldValue("confirmPassword", "wall-e");

				await vm.handleFormSubmit();

				expect(onSubmit).toHaveBeenCalledWith({ password: "wall-e", confirmPassword: "wall-e" });
			});

			test("Clears resolved form-level errors on resubmit", async () => {
				const onSubmit = vi.fn();
				const wrapper = mount({ props: { rules, onSubmit } });
				const vm = wrapper.vm;

				vm.registerField({ name: "password", id: "password-id" });
				vm.registerField({ name: "confirmPassword", id: "confirm-id" });

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

				vm.registerField({ name: "password", id: "password-id" });
				vm.registerField({ name: "confirmPassword", id: "confirm-id" });

				vm.updateFieldValue("password", "wall-e");
				vm.updateFieldValue("confirmPassword", "eve");

				await vm.handleFormSubmit();

				expect(vm.fieldErrorsFor("confirmPassword")).toEqual(["Passwords must match"]);
			});
		});

		describe("fieldTypes", () => {
			test("coerces submitted data per the declared field types", async () => {
				const onSubmit = vi.fn();
				const fieldTypes = { age: "nullable-number" };
				const wrapper = mount({ props: { fieldTypes, onSubmit } });
				const vm = wrapper.vm;

				vm.registerField({ name: "age", id: "age-id" });
				vm.updateFieldValue("age", "");

				await vm.handleFormSubmit();

				expect(onSubmit).toHaveBeenCalledWith({ age: null });
			});
		});
	});

	describe("Methods", () => {
		describe("registerField", () => {
			test("should initialise a field's value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.formData).toEqual({});

				vm.registerField({ name: "username" });

				expect(vm.formData).toEqual({ username: null });
			});

			test("should preserve an existing initial value", async () => {
				const wrapper = mount({ props: { modelValue: { username: "wall-e" } } });
				const vm = wrapper.vm;

				await vm.registerField({ name: "username" });

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

				wrapper.vm.registerField({ name: "name" });

				await wrapper.vm.handleFormSubmit();

				expect(onSubmit).toHaveBeenCalledWith({ name: null });
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

				wrapper.vm.registerField({ name: "email", id: "email-id" });

				await wrapper.vm.handleFormSubmit();

				expect(onSubmit).not.toHaveBeenCalled();
			});
		});

		describe("errorSummary", () => {
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

				vm.registerField({ name: "name", id: "name-id" });
				vm.registerField({ name: "email", id: "email-id" });

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

		test("exposes readonly", () => {
			const wrapper = mount({ props: { readonly: true } });

			expect(wrapper.vm.readonly).toBe(true);
		});

		test("exposes compact", () => {
			const wrapper = mount({ props: { compact: true } });

			expect(wrapper.vm.compact).toBe(true);
		});

		test("exposes fieldTypes", () => {
			const fieldTypes = { age: "nullable-number" };
			const wrapper = mount({ props: { fieldTypes } });

			expect(wrapper.vm.fieldTypes).toEqual(fieldTypes);
		});
	});

	describe("aria-busy", () => {
		test("aria-busy reflects isSubmitting", async () => {
			const wrapper = mount();

			expect(wrapper.attributes("aria-busy")).toBe("false");

			wrapper.vm.isSubmitting = true;
			await wrapper.vm.$nextTick();

			expect(wrapper.attributes("aria-busy")).toBe("true");
		});

		test("aria-busy resets after submit completes", async () => {
			const onSubmit = vi.fn();
			const wrapper = mount({ props: { onSubmit } });

			await wrapper.vm.handleFormSubmit();

			expect(wrapper.attributes("aria-busy")).toBe("false");
		});
	});
});
