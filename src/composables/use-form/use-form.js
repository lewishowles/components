import { callComponentMethod } from "@lewishowles/helpers/vue";
import { computed, nextTick, reactive, ref, toRef, toValue, unref, watch } from "vue";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject, isObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useFormData } from "@/composables/use-form-data/use-form-data.js";
import { validateForm } from "@lewishowles/helpers/form";

/**
 * Used by form-wrapper; also usable directly.
 *
 * @param  {object|ref}  [initialData]
 *     Seed for formData. A plain object, seeded immediately, or a ref/getter,
 *     seeded once it first resolves truthy.
 * @param  {function|object}  [mapper]
 *     Shapes initialData into form data, either a mapping function, or a
 *     `{ fields, fieldTypes }` options object for declarative field
 *     selection and type coercion.
 * @param  {object|ref|function}  [fieldTypes]
 *     Type coercion for form values on submit, keyed by field name. Each
 *     value is one of "nullable-number" or "nullable-string". For the
 *     equivalent coercion on init, use mapper's own fieldTypes instead.
 * @param  {object|ref|function}  [fieldErrors]
 *     Field-level errors managed by the caller, keyed by field name. Each
 *     value can be a single message or a list of messages.
 * @param  {object|ref|function}  [rules]
 *     Form-level validation rules, keyed by field name.
 * @param  {function}  [onSubmit]
 *     Called with the submit-ready data once validation passes. Its
 *     returned Promise (if any) is awaited before resetting the submit
 *     button; a rejection is passed to submitErrorsCallback.
 * @param  {ref|function|null}  [submitErrorsCallback]
 *     Maps a rejected submit error to field errors. Return an empty value
 *     for errors the form should not handle, which are re-thrown.
 * @param  {boolean|ref|function}  [updatePageTitleOnError]
 *     Whether failed validation prefixes the page title with
 *     pageTitleErrorPrefix.
 * @param  {string|ref|function}  [pageTitleErrorPrefix]
 *     Prefix added to document.title after failed validation.
 * @param  {boolean|ref|function}  [readonly]
 *     Whether all form fields should be treated as readonly.
 * @param  {ref}  [errorSummaryElement]
 *     Ref to the error summary element, focused after a failed submit.
 *     Only needed when calling handleFormSubmit directly; not required for
 *     the `form-wrapper v-bind="form"` pattern.
 * @param  {ref}  [generalErrorsElement]
 *     Ref to the general errors container, focused when only general errors
 *     exist. Only needed when calling handleFormSubmit directly.
 * @param  {ref}  [submitButtonRef]
 *     Ref to the submit button component, reset when the submit settles.
 *     Only needed when calling handleFormSubmit directly.
 */
export function useForm({
	initialData,
	mapper,
	fieldTypes,
	fieldErrors,
	rules,
	onSubmit,
	submitErrorsCallback,
	updatePageTitleOnError,
	pageTitleErrorPrefix,
	readonly,
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
}) {
	// Our form data.
	const formData = resolveInitialData(initialData, mapper);
	// A reference to each of our form fields once registered.
	const formFields = reactive({});
	// Whether we have any form fields registered to the form.
	const haveFormFields = computed(() => isNonEmptyObject(formFields));
	// Errors produced by the `submitErrorsCallback` from a rejected submit.
	const submitErrors = ref({});
	// Errors produced by form-level `rules`, keyed by field name.
	const formLevelErrors = ref({});

	// Parsed submit errors whose key doesn't match a registered field, surfaced
	// as general errors rather than field errors.
	const generalSubmitErrors = computed(() => {
		const messages = [];

		for (const key in submitErrors.value) {
			if (!Object.hasOwn(submitErrors.value, key)) {
				continue;
			}

			if (Object.hasOwn(formFields, key)) {
				continue;
			}

			messages.push(...normaliseFieldErrors(submitErrors.value[key]));
		}

		return messages;
	});

	// Whether we have any general (non-field) submit errors to show.
	const haveGeneralSubmitErrors = computed(() => isNonEmptyArray(generalSubmitErrors.value));
	// The stored prefixed page title so the wrapper can restore it after a
	// successful submit.
	const prefixedPageTitle = ref(null);

	// All field errors shown in the error summary, computed from a single merge
	// point per field.
	const errorSummary = computed(() => {
		const errors = [];

		for (const fieldName in formFields) {
			if (!Object.hasOwn(formFields, fieldName)) {
				continue;
			}

			fieldErrorsFor(fieldName).forEach((message) => {
				errors.push({ fieldName, id: formFields[fieldName].id, message });
			});
		}

		return errors;
	});

	// Whether our error summary contains any errors.
	const haveErrorSummary = computed(() => isNonEmptyArray(errorSummary.value));
	// Whether a form submission is currently in progress.
	const isSubmitting = ref(false);
	// Whether child fields should be readonly, derived from the readonly prop.
	const isReadonly = computed(() => toValue(readonly));

	// Field names that are required, either via a static `required` rule or a
	// `required_if` rule whose condition is currently met against live formData.
	const requiredFieldNames = computed(() => {
		const names = new Set();
		const data = formData.value;
		const currentRules = toValue(rules);

		for (const fieldName in currentRules) {
			if (!Object.hasOwn(currentRules, fieldName)) {
				continue;
			}

			const fieldRules = currentRules[fieldName];

			if (!Array.isArray(fieldRules)) {
				continue;
			}

			for (const rule of fieldRules) {
				if (rule?.rule === "required") {
					names.add(fieldName);

					break;
				}

				if (rule?.rule === "required_if" && data[rule.field] === rule.value) {
					names.add(fieldName);

					break;
				}
			}
		}

		return names;
	});

	// A bindable object for `v-bind="form"` on form-wrapper, packing the
	// v-model binding, rules, and submit handler into a single prop.
	const form = computed(() => ({
		modelValue: formData.value,
		"onUpdate:modelValue": (value) => {
			formData.value = value;
		},
		rules: toValue(rules),
		onSubmit,
	}));

	/**
	 * @param  {object|ref}  initialData
	 *     The seed for formData. A plain object, or a ref/getter to watch.
	 * @param  {function|object}  [mapper]
	 *     Shapes the resolved value into form data, either a mapping function,
	 *     or a `{ fields, fieldTypes }` options object for declarative field
	 *     selection and type coercion.
	 */
	function resolveInitialData(initialData, mapper) {
		const source = toRef(initialData);

		return mapper ? useFormData(source, mapper) : useFormData(source);
	}

	/**
	 * Check whether a field name has a required rule in the form-level rules.
	 *
	 * @param  {string}  fieldName
	 */
	function isFieldRequired(fieldName) {
		return requiredFieldNames.value.has(fieldName);
	}

	/**
	 * Allow a field to register itself with the form.
	 *
	 * @param  {string}    field.name
	 * @param  {string}    field.id
	 * @param  {function}  field.triggerFocus
	 */
	async function registerField(field) {
		if (!isObject(formData.value)) {
			formData.value = {};

			await nextTick();
		}

		if (Object.hasOwn(formFields, field.name)) {
			console.error(
				"<form-wrapper>",
				`Duplicate field name <${field.name}> detected. Only one field with a given name will be represented in form data.`,
			);
		}

		formFields[field.name] = field;

		if (!Object.hasOwn(formData.value, field.name)) {
			formData.value[field.name] = null;
		}
	}

	/**
	 * Allow a field to update its value in the form.
	 *
	 * @param  {string}   name
	 * @param  {unknown}  value
	 */
	async function updateFieldValue(name, value) {
		formData.value[name] = value;
	}

	/**
	 * Get all error messages for a field, combining parent-owned, submit
	 * callback, and form-level rule errors with deduplication.
	 *
	 * @param  {string}  fieldName
	 */
	function fieldErrorsFor(fieldName) {
		const seen = new Set();

		return [
			...normaliseFieldErrors(toValue(fieldErrors)?.[fieldName]),
			...normaliseFieldErrors(submitErrors.value?.[fieldName]),
			...normaliseFieldErrors(formLevelErrors.value[fieldName]),
		].filter((message) => {
			if (seen.has(message)) {
				return false;
			}

			seen.add(message);

			return true;
		});
	}

	/**
	 * Normalise a field's error value into an array of non-empty messages.
	 *
	 * @param  {string|Array}  value
	 */
	function normaliseFieldErrors(value) {
		if (isNonEmptyString(value)) {
			return [value];
		}

		if (!isNonEmptyArray(value)) {
			return [];
		}

		return value.filter((message) => isNonEmptyString(message));
	}

	/**
	 * Focus the error summary after Vue has rendered the latest errors.
	 */
	async function focusErrorSummary() {
		await nextTick();

		callComponentMethod(errorSummaryElement?.value, "focus");
	}

	/**
	 * Focus the general errors container when only general errors are present.
	 */
	async function focusGeneralErrors() {
		await nextTick();

		callComponentMethod(generalErrorsElement?.value, "focus");
	}

	/**
	 * After a failed submit, focus the error summary when field errors are
	 * present, or the general errors container when only general errors exist.
	 */
	async function focusAfterFailedSubmit() {
		if (haveErrorSummary.value) {
			await focusErrorSummary();
		} else if (haveGeneralSubmitErrors.value) {
			await focusGeneralErrors();
		}
	}

	/**
	 * Add the error prefix to the page title after a failed submit.
	 */
	function updatePageTitle() {
		if (!toValue(updatePageTitleOnError)) {
			return;
		}

		const prefix = `${toValue(pageTitleErrorPrefix)} `;

		if (document.title.startsWith(prefix)) {
			return;
		}

		prefixedPageTitle.value = `${prefix}${document.title}`;
		document.title = prefixedPageTitle.value;
	}

	/**
	 * Remove the error prefix the wrapper added. Called automatically on
	 * successful submit.
	 */
	function clearPageTitle() {
		if (!prefixedPageTitle.value) {
			return;
		}

		document.title = document.title.slice(toValue(pageTitleErrorPrefix).length + 1);
		prefixedPageTitle.value = null;
	}

	/**
	 * Validate the form-level `rules` against the current form data, mapping any
	 * errors to their field name.
	 */
	async function validateFormLevelRules() {
		const currentRules = toValue(rules);

		if (!isNonEmptyObject(currentRules)) {
			formLevelErrors.value = {};

			return;
		}

		const { results } = await validateForm(currentRules, formData.value);
		const errors = {};

		for (const fieldName in results) {
			if (!Object.hasOwn(results, fieldName)) {
				continue;
			}

			const fieldErrors = results[fieldName].errors;

			if (isNonEmptyArray(fieldErrors)) {
				errors[fieldName] = fieldErrors;
			}
		}

		formLevelErrors.value = errors;
	}

	/**
	 * Handle the submit of the form, checking any provided validation, and
	 * submitting the appropriate event if validation succeeds.
	 */
	async function handleFormSubmit() {
		submitErrors.value = {};
		formLevelErrors.value = {};

		if (!haveFormFields.value) {
			await doSubmit();

			return;
		}

		await validateFormLevelRules();

		if (haveErrorSummary.value) {
			resetSubmitButton();
			updatePageTitle();
			await focusAfterFailedSubmit();

			return;
		}

		await doSubmit();
	}

	/**
	 * Get the form data to submit, coerced per `fieldTypes`.
	 *
	 * @returns {object}
	 *     A plain object of submit-ready values.
	 */
	function getSubmitData() {
		return normaliseForSubmit(formData.value, toValue(fieldTypes) ?? {});
	}

	/**
	 * Call onSubmit with the submit-ready data, tracking any returned Promise
	 * to auto-reset the submit button when the async work settles.
	 */
	async function doSubmit() {
		isSubmitting.value = true;

		try {
			await onSubmit?.(getSubmitData());
			clearPageTitle();
		} catch (error) {
			await handleSubmitError(error);
		} finally {
			resetSubmitButton();
		}
	}

	/**
	 * Handle a rejected submit Promise. If a `submitErrorsCallback` is provided
	 * and can map the error to field errors, surface those; otherwise re-throw.
	 *
	 * @param  {unknown}  error
	 */
	async function handleSubmitError(error) {
		const callback = unref(submitErrorsCallback);

		if (!isFunction(callback)) {
			throw error;
		}

		const parsedErrors = callback(error);

		if (!isNonEmptyObject(parsedErrors)) {
			throw error;
		}

		submitErrors.value = parsedErrors;

		await focusAfterFailedSubmit();
	}

	/**
	 * Reset the submit button's loading state.
	 */
	function resetSubmitButton() {
		isSubmitting.value = false;

		callComponentMethod(submitButtonRef?.value, "reset");
	}

	/**
	 * Trigger focus on the underlying form field.
	 *
	 * @param  {string}  fieldName
	 */
	function focusField(fieldName) {
		if (!Object.hasOwn(formFields, fieldName)) {
			return;
		}

		callComponentMethod(formFields[fieldName], "triggerFocus");
	}

	watch(
		() => toValue(fieldErrors),
		async () => {
			if (!isNonEmptyArray(errorSummary.value)) {
				return;
			}

			await focusErrorSummary();
		},
		{ deep: true },
	);

	return {
		form,
		formData,
		formFields,
		haveFormFields,
		submitErrors,
		formLevelErrors,
		generalSubmitErrors,
		haveGeneralSubmitErrors,
		errorSummary,
		haveErrorSummary,
		isSubmitting,
		isReadonly,
		registerField,
		updateFieldValue,
		fieldErrorsFor,
		handleFormSubmit,
		handleSubmitError,
		resetSubmitButton,
		focusField,
		isFieldRequired,
		getSubmitData,
	};
}

/**
 * Normalise field values for form submission based on declared field types.
 *
 * @param  {object}  data
 *     The form data to normalise.
 * @param  {object}  fieldTypes
 *     Field type transformations keyed by field name, each value one of
 *     "nullable-number" or "nullable-string".
 * @returns {object}
 *     A new object with normalised values.
 */
export function normaliseForSubmit(data, fieldTypes) {
	const result = {};

	for (const [key, value] of Object.entries(data)) {
		const fieldType = fieldTypes[key];

		if (fieldType === "nullable-number") {
			if (value === "" || value == null) {
				result[key] = null;
			} else {
				const number = Number(value);

				result[key] = Number.isNaN(number) ? null : number;
			}
		} else if (fieldType === "nullable-string") {
			result[key] = value === "" ? null : value;
		} else {
			result[key] = value;
		}
	}

	return result;
}
