import { nextTick, ref } from "vue";
import { describe, expect, test, vi } from "vite-plus/test";
import { normaliseForSubmit, useForm } from "./use-form.js";

// Build a useForm instance with sensible defaults for props and DOM refs.
function createForm(overrides = {}) {
	const namedParams = {
		fieldErrors: {},
		rules: {},
		submitErrorsCallback: null,
		updatePageTitleOnError: true,
		pageTitleErrorPrefix: "Error:",
		readonly: false,
		fieldTypes: {},
		...overrides.props,
	};

	const form = useForm({
		initialData: overrides.initialData ?? {},
		mapper: overrides.mapper,
		...namedParams,
		errorSummaryElement: ref(null),
		generalErrorsElement: ref(null),
		submitButtonRef: ref(null),
	});

	return { ...form };
}

describe("useForm", () => {
	describe("Initialisation", () => {
		test("should return an object", () => {
			expect(createForm()).toBeTypeOf("object");
		});

		test("isSubmitting starts false", () => {
			const { isSubmitting } = createForm();

			expect(isSubmitting.value).toBe(false);
		});

		test("isReadonly reflects the readonly prop", () => {
			const { isReadonly } = createForm({ props: { readonly: true } });

			expect(isReadonly.value).toBe(true);
		});
	});

	describe("initialData", () => {
		test("seeds formData immediately from a plain object", () => {
			const { formData } = createForm({ initialData: { name: "Alice" } });

			expect(formData.value).toEqual({ name: "Alice" });
		});

		test("seeds formData once a ref source resolves truthy", async () => {
			const source = ref(null);
			const { formData } = createForm({ initialData: source });

			expect(formData.value).toEqual({});

			source.value = { name: "Alice" };
			await vi.waitFor(() => expect(formData.value).toEqual({ name: "Alice" }));
		});

		test("does not re-seed a ref source after the first populate", async () => {
			const source = ref({ name: "Alice" });
			const { formData } = createForm({ initialData: source });

			await vi.waitFor(() => expect(formData.value).toEqual({ name: "Alice" }));

			source.value = { name: "Bob" };
			await nextTick();

			expect(formData.value).toEqual({ name: "Alice" });
		});

		test("applies a fields/fieldTypes mapper without re-implementing useFormData", () => {
			const { formData } = createForm({
				initialData: { age: 30, extra: "ignored" },
				mapper: { fields: ["age"], fieldTypes: { age: "nullable-number" } },
			});

			expect(formData.value).toEqual({ age: "30" });
		});
	});

	describe("form", () => {
		test("modelValue reflects the current formData", () => {
			const { form, formData } = createForm({ initialData: { name: "Alice" } });

			expect(form.value.modelValue).toBe(formData.value);
		});

		test("onUpdate:modelValue writes back into formData", () => {
			const { form, formData } = createForm({ initialData: { name: "Alice" } });

			form.value["onUpdate:modelValue"]({ name: "Bob" });

			expect(formData.value).toEqual({ name: "Bob" });
		});

		test("rules reflects the current rules value", () => {
			const rules = { name: [{ rule: "required" }] };
			const { form } = createForm({ props: { rules } });

			expect(form.value.rules).toBe(rules);
		});

		test("onSubmit is the provided onSubmit handler", () => {
			const onSubmit = vi.fn();
			const { form } = createForm({ props: { onSubmit } });

			expect(form.value.onSubmit).toBe(onSubmit);
		});
	});

	describe("optional DOM refs", () => {
		test("resetSubmitButton does not throw when submitButtonRef is omitted", async () => {
			const { handleFormSubmit } = useForm({ initialData: {}, onSubmit: vi.fn() });

			await handleFormSubmit();
		});

		test("a failed submit does not throw when error refs are omitted", async () => {
			const { registerField, handleFormSubmit } = useForm({
				initialData: {},
				rules: { email: [{ rule: "required", message: "Required" }] },
				onSubmit: vi.fn(),
			});

			await registerField({ name: "email", id: "email-id" });

			await handleFormSubmit();
		});
	});

	describe("registerField", () => {
		test("adds the field to formFields", async () => {
			const { formFields, registerField } = createForm();

			await registerField({ name: "email", id: "email-id" });

			expect(formFields).toHaveProperty("email");
		});

		test("seeds a null entry in formData for a new field", async () => {
			const { formData, registerField } = createForm();

			await registerField({ name: "email", id: "email-id" });

			expect(formData.value).toHaveProperty("email", null);
		});

		test("does not overwrite an existing formData value on register", async () => {
			const { formData, registerField } = createForm();

			formData.value = { email: "existing@example.com" };

			await registerField({ name: "email", id: "email-id" });

			expect(formData.value.email).toBe("existing@example.com");
		});

		test("logs an error for duplicate field names", async () => {
			const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			const { registerField } = createForm();

			await registerField({ name: "email", id: "email-id" });
			await registerField({ name: "email", id: "email-id-2" });

			expect(consoleSpy).toHaveBeenCalledWith(
				"<form-wrapper>",
				expect.stringContaining("Duplicate field name <email>"),
			);

			consoleSpy.mockRestore();
		});

		test("initialises formData to an object when it is not one", async () => {
			const { formData, registerField } = createForm();

			formData.value = null;

			await registerField({ name: "email", id: "email-id" });

			expect(formData.value).toBeTypeOf("object");
		});
	});

	describe("updateFieldValue", () => {
		test("updates the named field in formData", async () => {
			const { formData, registerField, updateFieldValue } = createForm();

			await registerField({ name: "email", id: "email-id" });
			await updateFieldValue("email", "user@example.com");

			expect(formData.value.email).toBe("user@example.com");
		});
	});

	describe("fieldErrorsFor", () => {
		test("returns an empty array when there are no errors", async () => {
			const { registerField, fieldErrorsFor } = createForm();

			await registerField({ name: "email", id: "email-id" });

			expect(fieldErrorsFor("email")).toEqual([]);
		});

		test("returns errors from fieldErrors prop", async () => {
			const { registerField, fieldErrorsFor } = createForm({
				props: { fieldErrors: { email: "Invalid email" } },
			});

			await registerField({ name: "email", id: "email-id" });

			expect(fieldErrorsFor("email")).toEqual(["Invalid email"]);
		});

		test("returns an array when fieldErrors prop contains a list", async () => {
			const { registerField, fieldErrorsFor } = createForm({
				props: { fieldErrors: { email: ["Too short", "Invalid format"] } },
			});

			await registerField({ name: "email", id: "email-id" });

			expect(fieldErrorsFor("email")).toEqual(["Too short", "Invalid format"]);
		});

		test("deduplicates identical messages across sources", async () => {
			const { registerField, submitErrors, fieldErrorsFor } = createForm({
				props: { fieldErrors: { email: "Required" } },
			});

			await registerField({ name: "email", id: "email-id" });

			submitErrors.value = { email: "Required" };

			expect(fieldErrorsFor("email")).toEqual(["Required"]);
		});

		test("combines distinct messages from multiple sources", async () => {
			const { registerField, submitErrors, fieldErrorsFor } = createForm({
				props: { fieldErrors: { email: "Invalid email" } },
			});

			await registerField({ name: "email", id: "email-id" });

			submitErrors.value = { email: "Already taken" };

			expect(fieldErrorsFor("email")).toEqual(["Invalid email", "Already taken"]);
		});
	});

	describe("isFieldRequired", () => {
		test("returns true when the field has a required rule", () => {
			const { isFieldRequired } = createForm({
				props: { rules: { email: [{ rule: "required" }] } },
			});

			expect(isFieldRequired("email")).toBe(true);
		});

		test("returns false when the field has no required rule", () => {
			const { isFieldRequired } = createForm({
				props: { rules: { email: [{ rule: "email" }] } },
			});

			expect(isFieldRequired("email")).toBe(false);
		});

		test("returns false for a field not in rules", () => {
			const { isFieldRequired } = createForm();

			expect(isFieldRequired("email")).toBe(false);
		});

		test("returns true when required_if condition is met", () => {
			const { formData, isFieldRequired } = createForm({
				props: {
					rules: {
						vatNumber: [{ rule: "required_if", field: "isVatRegistered", value: "yes" }],
					},
				},
			});

			formData.value.isVatRegistered = "yes";

			expect(isFieldRequired("vatNumber")).toBe(true);
		});

		test("returns false when required_if condition is not met", () => {
			const { formData, isFieldRequired } = createForm({
				props: {
					rules: {
						vatNumber: [{ rule: "required_if", field: "isVatRegistered", value: "yes" }],
					},
				},
			});

			formData.value.isVatRegistered = "no";

			expect(isFieldRequired("vatNumber")).toBe(false);
		});

		test("updates reactively when the dependent field changes", () => {
			const { formData, isFieldRequired } = createForm({
				props: {
					rules: {
						vatNumber: [{ rule: "required_if", field: "isVatRegistered", value: "yes" }],
					},
				},
			});

			expect(isFieldRequired("vatNumber")).toBe(false);

			formData.value.isVatRegistered = "yes";

			expect(isFieldRequired("vatNumber")).toBe(true);

			formData.value.isVatRegistered = "no";

			expect(isFieldRequired("vatNumber")).toBe(false);
		});
	});

	describe("errorSummary", () => {
		test("is empty when no fields are registered", () => {
			const { errorSummary } = createForm();

			expect(errorSummary.value).toEqual([]);
		});

		test("includes an entry for each field error", async () => {
			const { registerField, submitErrors, errorSummary } = createForm();

			await registerField({ name: "email", id: "email-id" });

			submitErrors.value = { email: "Required" };

			expect(errorSummary.value).toEqual([
				{ fieldName: "email", id: "email-id", message: "Required" },
			]);
		});
	});

	describe("generalSubmitErrors", () => {
		test("surfaces errors for keys that do not match a registered field", async () => {
			const { registerField, submitErrors, generalSubmitErrors } = createForm();

			await registerField({ name: "email", id: "email-id" });

			submitErrors.value = { form: "Something went wrong" };

			expect(generalSubmitErrors.value).toEqual(["Something went wrong"]);
		});

		test("does not include errors for registered fields", async () => {
			const { registerField, submitErrors, generalSubmitErrors } = createForm();

			await registerField({ name: "email", id: "email-id" });

			submitErrors.value = { email: "Required" };

			expect(generalSubmitErrors.value).toEqual([]);
		});
	});

	describe("resetSubmitButton", () => {
		test("sets isSubmitting to false", () => {
			const { isSubmitting, resetSubmitButton } = createForm();

			isSubmitting.value = true;
			resetSubmitButton();

			expect(isSubmitting.value).toBe(false);
		});
	});

	describe("handleFormSubmit", () => {
		test("calls the onSubmit handler when there are no registered fields", async () => {
			const handler = vi.fn().mockResolvedValue(undefined);
			const { handleFormSubmit } = createForm({ props: { onSubmit: handler } });

			await handleFormSubmit();

			expect(handler).toHaveBeenCalled();
		});

		test("calls the onSubmit handler with data coerced per fieldTypes", async () => {
			const handler = vi.fn().mockResolvedValue(undefined);

			const { formData, handleFormSubmit } = createForm({
				props: { onSubmit: handler, fieldTypes: { age: "nullable-number" } },
			});

			formData.value.age = "";

			await handleFormSubmit();

			expect(handler).toHaveBeenCalledWith({ age: null });
		});

		test("clears formLevelErrors from a previous submit before re-validating", async () => {
			const { registerField, formLevelErrors, handleFormSubmit } = createForm({
				props: { rules: { email: [{ rule: "required" }] } },
			});

			await registerField({ name: "email", id: "email-id" });

			formLevelErrors.value = { email: ["Required"] };

			await handleFormSubmit();

			// handleFormSubmit clears errors at the start of each attempt
			// (validateFormLevelRules may re-populate them, but the stale set is gone)
			expect(formLevelErrors.value).not.toEqual({ email: ["Required"] });
		});

		test("clears submitErrors and formLevelErrors at the start of each submit", async () => {
			const { submitErrors, formLevelErrors, handleFormSubmit } = createForm();

			submitErrors.value = { email: "Old error" };
			formLevelErrors.value = { email: ["Old rule error"] };

			await handleFormSubmit();

			expect(submitErrors.value).toEqual({});
			expect(formLevelErrors.value).toEqual({});
		});
	});

	describe("handleSubmitError", () => {
		test("maps a rejected error to a registered field", async () => {
			const { registerField, handleSubmitError, errorSummary } = createForm({
				props: { submitErrorsCallback: () => ({ email: "That email is taken" }) },
			});

			await registerField({ name: "email", id: "email-id" });
			await handleSubmitError(new Error("Request failed"));

			expect(errorSummary.value).toEqual([
				{ fieldName: "email", id: "email-id", message: "That email is taken" },
			]);
		});

		test("normalises a list of messages for a field", async () => {
			const { registerField, handleSubmitError, errorSummary } = createForm({
				props: { submitErrorsCallback: () => ({ name: ["Too short", "Required"] }) },
			});

			await registerField({ name: "name", id: "name-id" });
			await handleSubmitError(new Error("Request failed"));

			expect(errorSummary.value).toEqual([
				{ fieldName: "name", id: "name-id", message: "Too short" },
				{ fieldName: "name", id: "name-id", message: "Required" },
			]);
		});

		test("surfaces errors for unknown fields as general errors", async () => {
			const { handleSubmitError, generalSubmitErrors, errorSummary } = createForm({
				props: { submitErrorsCallback: () => ({ form: "Something went wrong" }) },
			});

			await handleSubmitError(new Error("Request failed"));

			expect(generalSubmitErrors.value).toEqual(["Something went wrong"]);
			expect(errorSummary.value).toEqual([]);
		});

		test("re-throws when the adapter returns nothing mappable", async () => {
			const error = new Error("Server error");

			const { handleSubmitError, generalSubmitErrors } = createForm({
				props: { submitErrorsCallback: () => null },
			});

			await expect(handleSubmitError(error)).rejects.toThrow(error);
			expect(generalSubmitErrors.value).toEqual([]);
		});

		test("re-throws when no submitErrorsCallback is provided", async () => {
			const error = new Error("Server error");
			const { handleSubmitError } = createForm();

			await expect(handleSubmitError(error)).rejects.toThrow(error);
		});

		test("combines parent-owned and adapter errors for the same field", async () => {
			const { registerField, handleSubmitError, fieldErrorsFor } = createForm({
				props: {
					fieldErrors: { email: "Parent error" },
					submitErrorsCallback: () => ({ email: "API error" }),
				},
			});

			await registerField({ name: "email", id: "email-id" });
			await handleSubmitError(new Error("Request failed"));

			expect(fieldErrorsFor("email")).toEqual(["Parent error", "API error"]);
		});

		test("deduplicates identical messages from parent-owned and adapter sources", async () => {
			const { registerField, handleSubmitError, fieldErrorsFor } = createForm({
				props: {
					fieldErrors: { email: "Already taken" },
					submitErrorsCallback: () => ({ email: "Already taken" }),
				},
			});

			await registerField({ name: "email", id: "email-id" });
			await handleSubmitError(new Error("Request failed"));

			expect(fieldErrorsFor("email")).toEqual(["Already taken"]);
		});
	});

	describe("focusField", () => {
		test("calls triggerFocus on a registered field", async () => {
			const triggerFocus = vi.fn();
			const { registerField, focusField } = createForm();

			await registerField({ name: "email", id: "email-id", triggerFocus });

			focusField("email");

			expect(triggerFocus).toHaveBeenCalled();
		});

		test("does nothing for an unregistered field name", () => {
			const { focusField } = createForm();

			expect(() => focusField("unknown")).not.toThrow();
		});
	});

	describe("getSubmitData", () => {
		test("returns formData unchanged when no fieldTypes are declared", () => {
			const { formData, getSubmitData } = createForm();

			formData.value = { name: "Alice" };

			expect(getSubmitData()).toEqual({ name: "Alice" });
		});

		test("coerces fields per the fieldTypes prop", () => {
			const { formData, getSubmitData } = createForm({
				props: { fieldTypes: { age: "nullable-number", notes: "nullable-string" } },
			});

			formData.value = { age: "", notes: "" };

			expect(getSubmitData()).toEqual({ age: null, notes: null });
		});
	});
});

describe("normaliseForSubmit", () => {
	test("nullable-number converts an empty string to null", () => {
		expect(normaliseForSubmit({ age: "" }, { age: "nullable-number" })).toEqual({ age: null });
	});

	test("nullable-number converts null to null", () => {
		expect(normaliseForSubmit({ age: null }, { age: "nullable-number" })).toEqual({ age: null });
	});

	test("nullable-number converts undefined to null", () => {
		expect(normaliseForSubmit({ age: undefined }, { age: "nullable-number" })).toEqual({
			age: null,
		});
	});

	test("nullable-number converts a numeric string to a number", () => {
		expect(normaliseForSubmit({ age: "30" }, { age: "nullable-number" })).toEqual({ age: 30 });
	});

	test("nullable-number converts a non-numeric string to null", () => {
		expect(normaliseForSubmit({ age: "abc" }, { age: "nullable-number" })).toEqual({ age: null });
	});

	test("nullable-string converts an empty string to null", () => {
		expect(normaliseForSubmit({ notes: "" }, { notes: "nullable-string" })).toEqual({
			notes: null,
		});
	});

	test("nullable-string keeps a real string value as-is", () => {
		expect(normaliseForSubmit({ notes: "Some notes" }, { notes: "nullable-string" })).toEqual({
			notes: "Some notes",
		});
	});

	test("fields without a listed type pass through unchanged", () => {
		expect(
			normaliseForSubmit({ name: "Alice", age: "30", notes: "" }, { age: "nullable-number" }),
		).toEqual({
			name: "Alice",
			age: 30,
			notes: "",
		});
	});
});
