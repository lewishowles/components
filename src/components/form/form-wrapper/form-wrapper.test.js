import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, test, vi } from "vite-plus/test";
import { nextTick, ref } from "vue";
import { useForm } from "@/composables/use-form/use-form.js";
import FormWrapper from "./form-wrapper.vue";

const mount = createMount(FormWrapper);
const mountDeep = createDeepMount(FormWrapper);

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

			test("coerces modelValue per the declared field types", async () => {
				const wrapper = mount({
					props: {
						fieldTypes: { age: "nullable-number" },
						modelValue: { age: 30 },
					},
				});

				await nextTick();

				expect(wrapper.vm.formData).toEqual({ age: "30" });
			});
		});

		describe("initialData", () => {
			test("uses modelValue without emitting when initialData is not bound", async () => {
				const wrapper = mount({ props: { modelValue: { name: "Alice" } } });

				await nextTick();

				expect(wrapper.vm.formData).toEqual({ name: "Alice" });
				expect(wrapper.emitted("update:modelValue")).toBeUndefined();
			});

			test("Emits synchronously available initialData through v-model", async () => {
				const wrapper = mount({ props: { initialData: () => ({ name: "Alice" }) } });

				await nextTick();

				expect(wrapper.emitted("update:modelValue")).toEqual([[{ name: "Alice" }]]);
			});

			test("seeds once when an initialData getter resolves", async () => {
				const source = ref(null);
				const wrapper = mount({ props: { initialData: () => source.value } });

				source.value = { name: "Alice" };
				await nextTick();

				expect(wrapper.vm.formData).toEqual({ name: "Alice" });

				source.value = { name: "Bob" };
				await nextTick();

				expect(wrapper.vm.formData).toEqual({ name: "Alice" });
			});
		});

		describe("recordId", () => {
			test("reseeds a clean form when the next record's data resolves", async () => {
				const source = ref({ name: "Alice" });

				const wrapper = mount({
					props: { initialData: () => source.value, recordId: 1 },
				});

				await nextTick();
				await wrapper.setProps({ recordId: 2 });

				source.value = { name: "Bob" };
				await nextTick();

				expect(wrapper.vm.formData).toEqual({ name: "Bob" });
				expect(wrapper.vm.isDirty).toBe(false);
			});

			test("does not reseed a dirty form when the record changes", async () => {
				const source = ref({ name: "Alice" });

				const wrapper = mount({
					props: { initialData: () => source.value, recordId: 1 },
				});

				await nextTick();
				wrapper.vm.updateFieldValue("name", "Edited");
				await nextTick();
				await wrapper.setProps({ recordId: 2 });

				source.value = { name: "Bob" };
				await nextTick();

				expect(wrapper.vm.formData).toEqual({ name: "Edited" });
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

		describe("unregisterField", () => {
			test("removes a live registration while preserving form data", async () => {
				const wrapper = mount({
					props: {
						modelValue: { username: "wall-e" },
						fieldErrors: { username: "Enter a different username" },
					},
				});

				const vm = wrapper.vm;

				await vm.registerField({ name: "username", id: "username-id" });
				vm.unregisterField("username");

				expect(vm.formData).toEqual({ username: "wall-e" });
				expect(vm.errorSummary).toEqual([]);
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

			test("emits update:modelValue with the new form data", async () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.updateFieldValue("username", "wall-e");
				await vi.waitFor(() => expect(wrapper.emitted("update:modelValue")).toBeTruthy());

				const [lastEmit] = wrapper.emitted("update:modelValue").at(-1);

				expect(lastEmit).toEqual({ username: "wall-e" });
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

		test("exposes unsavedChangesGuard", () => {
			const wrapper = mount({ props: { unsavedChangesGuard: false } });

			expect(wrapper.vm.unsavedChangesGuard).toBe(false);
		});

		test("exposes isDirty, reflecting whether formData has changed", async () => {
			const wrapper = mount({ props: { modelValue: { name: "Alice" } } });

			expect(wrapper.vm.isDirty).toBe(false);

			await wrapper.vm.updateFieldValue("name", "Bob");

			expect(wrapper.vm.isDirty).toBe(true);
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

	describe("useForm()'s form binding", () => {
		test("modelValue seeds formData, rules block an invalid submit, and onSubmit is not called", async () => {
			const onSubmit = vi.fn();

			const { form } = useForm({
				initialData: { email: "" },
				rules: { email: [{ rule: "required", message: "Required" }] },
				onSubmit,
			});

			const wrapper = mount({ props: { ...form.value } });

			wrapper.vm.registerField({ name: "email", id: "email-id" });

			expect(wrapper.vm.formData).toEqual({ email: "" });

			await wrapper.vm.handleFormSubmit();

			expect(wrapper.vm.errorSummary).toEqual([
				{ fieldName: "email", id: "email-id", message: "Required" },
			]);
			expect(onSubmit).not.toHaveBeenCalled();
		});

		test("onSubmit is called with the wrapper's submit-ready data once rules pass", async () => {
			const onSubmit = vi.fn();

			const { form } = useForm({
				initialData: { email: "person@example.com" },
				rules: { email: [{ rule: "required", message: "Required" }] },
				onSubmit,
			});

			const wrapper = mount({ props: { ...form.value } });

			wrapper.vm.registerField({ name: "email", id: "email-id" });

			await wrapper.vm.handleFormSubmit();
			await flushPromises();

			expect(onSubmit).toHaveBeenCalledWith({ email: "person@example.com" });
		});

		test("onUpdate:modelValue writes the wrapper's edits back into the outer formData", async () => {
			const { form, formData } = useForm({ initialData: { email: "" }, onSubmit: vi.fn() });
			const wrapper = mount({ props: { ...form.value } });

			wrapper.vm.registerField({ name: "email", id: "email-id" });
			wrapper.vm.updateFieldValue("email", "person@example.com");

			await flushPromises();

			expect(formData.value).toEqual({ email: "person@example.com" });
		});

		test("propagates the outer useForm's unsavedChangesGuard to the wrapper's own instance", () => {
			vi.spyOn(window, "addEventListener");

			const { form } = useForm({ initialData: { email: "" }, unsavedChangesGuard: false });

			mount({ props: { ...form.value } });

			expect(window.addEventListener).not.toHaveBeenCalledWith(
				"beforeunload",
				expect.any(Function),
			);

			vi.restoreAllMocks();
		});
	});

	describe("status", () => {
		test("does not show a status alert for a successful submit with no message", async () => {
			const onSubmit = vi.fn();
			const wrapper = mountDeep({ props: { onSubmit } });

			await wrapper.vm.handleFormSubmit();
			await flushPromises();

			expect(wrapper.find('[data-test="form-wrapper-status"]').exists()).toBe(false);
		});

		test("shows the engine's status after an unhandled submit error", async () => {
			const onSubmit = vi.fn(() => Promise.reject(new Error("Request failed")));
			const wrapper = mountDeep({ props: { onSubmit } });

			await expect(wrapper.vm.handleFormSubmit()).rejects.toThrow("Request failed");
			await flushPromises();

			const status = wrapper.find('[data-test="form-wrapper-status"]');

			expect(status.exists()).toBe(true);
			expect(status.text()).toBe("Error: Request failed");
		});

		test("the status prop overrides the engine's own status", async () => {
			const onSubmit = vi.fn();

			const wrapper = mountDeep({
				props: { onSubmit, status: { type: "error", message: "Session expired" } },
			});

			await wrapper.vm.handleFormSubmit();
			await flushPromises();

			const status = wrapper.find('[data-test="form-wrapper-status"]');

			expect(status.text()).toBe("Error: Session expired");
		});

		test("does not show status when neither the prop nor a submit result is set", () => {
			const wrapper = mountDeep();

			expect(wrapper.find('[data-test="form-wrapper-status"]').exists()).toBe(false);
		});
	});

	describe("submit lifecycle hooks", () => {
		test("calls onSuccess with the submit result and submitted data", async () => {
			const onSuccess = vi.fn();
			const onSubmit = vi.fn().mockResolvedValue({ id: 12 });
			const wrapper = mount({ props: { onSubmit, onSuccess } });

			await wrapper.vm.handleFormSubmit();
			await flushPromises();

			expect(onSuccess).toHaveBeenCalledWith({ id: 12 }, {});
		});

		test("calls onError with the submit error and submitted data", async () => {
			const error = new Error("Request failed");
			const onError = vi.fn();
			const onSubmit = vi.fn().mockRejectedValue(error);
			const wrapper = mount({ props: { onSubmit, onError } });

			await expect(wrapper.vm.handleFormSubmit()).rejects.toThrow(error);

			expect(onError).toHaveBeenCalledWith(error, {});
		});

		test("calls onSettled after both a successful and a failed submit", async () => {
			const onSettled = vi.fn();

			const onSubmit = vi
				.fn()
				.mockResolvedValueOnce("saved")
				.mockRejectedValueOnce(new Error("Request failed"));

			const wrapper = mount({ props: { onSubmit, onSettled } });

			await wrapper.vm.handleFormSubmit();

			expect(onSettled).toHaveBeenCalledWith("saved", undefined, {});

			await expect(wrapper.vm.handleFormSubmit()).rejects.toThrow("Request failed");

			expect(onSettled).toHaveBeenCalledWith(undefined, expect.any(Error), {});
		});
	});
});
