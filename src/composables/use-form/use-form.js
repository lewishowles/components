import { callComponentMethod } from "@lewishowles/helpers/vue";
import {
	computed,
	nextTick,
	onUnmounted,
	reactive,
	ref,
	toRaw,
	toRef,
	toValue,
	unref,
	watch,
} from "vue";
import { isEqual, isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject, isObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { mapFormData } from "@/composables/use-form-data/use-form-data.js";
import { registerDirtyForm, unregisterDirtyForm } from "./dirty-forms-registry.js";
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
 * @param  {string|number|ref|function|null}  [recordId]
 *     Identifies the record initialData represents. Omit for the default
 *     populate-once-forever behaviour. Provide to reseed formData from the
 *     current initialData/mapper output whenever recordId changes to a new
 *     truthy value and the form isn't dirty; if the form is dirty, the change
 *     is ignored until the caller resolves it, e.g. by waiting for the user
 *     to save or discard their changes.
 * @param  {boolean}  [unsavedChangesGuard]
 *     Whether this form should guard against losing unsaved changes: warn on
 *     tab close/refresh while dirty, and contribute to the shared dirty-form
 *     count that installUnsavedChangesGuard's router guard checks. Defaults
 *     to true. Set to false for trivial forms (e.g. a live search filter)
 *     where the guard would be unwanted noise.
 * @param  {object|ref|function}  [fieldTypes]
 *     Type coercion for form values on submit, keyed by field name. Each
 *     value is one of "nullable-number" or "nullable-string". For the
 *     equivalent coercion on init, use mapper's own fieldTypes instead.
 * @param  {object|ref|function}  [fieldErrors]
 *     Field-level errors managed by the caller, keyed by field name. Each
 *     value can be a single message or a list of messages.
 * @param  {object|ref|function}  [rules]
 *     Form-level validation rules, keyed by field name.
 * @param  {object|ref|function}  [schema]
 *     A whole-object Standard Schema (e.g. Zod, Valibot) validated against the
 *     full form data alongside rules. Both run together and merge into one
 *     per-field result; each issue's path[0] maps it to its field. Cross-field
 *     rules (same, required_if, different, custom) still need rules, since a
 *     whole-object schema can't express them.
 * @param  {function}  [onSubmit]
 *     Called with the submit-ready data once validation passes. Its
 *     returned Promise (if any) is awaited before resetting the submit
 *     button; a rejection is passed to submitErrorsCallback.
 * @param  {ref|function}  [onSuccess]
 *     Called with onSubmit's resolved return value and submitted form data.
 * @param  {ref|function}  [onError]
 *     Called with onSubmit's rejection error and submitted form data.
 * @param  {ref|function}  [onSettled]
 *     Called with the submit result, error, and submitted form data.
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
	recordId,
	unsavedChangesGuard = true,
	fieldTypes,
	fieldErrors,
	rules,
	schema,
	onSubmit,
	onSuccess,
	onError,
	onSettled,
	submitErrorsCallback,
	updatePageTitleOnError,
	pageTitleErrorPrefix,
	readonly,
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
}) {
	// The resolved initialData source, watched to (re)seed formData.
	const source = toRef(initialData);
	// Our form data.
	const formData = ref({});
	// Whether formData has been seeded at least once.
	const seeded = ref(false);
	// A snapshot of formData taken immediately after the last (re)seed,
	// compared against for isDirty.
	const baseline = ref({});
	// A reference to each of our form fields once registered.
	const formFields = reactive({});
	// Whether we have any form fields registered to the form.
	const haveFormFields = computed(() => isNonEmptyObject(formFields));
	// Errors produced by the `submitErrorsCallback` from a rejected submit.
	const submitErrors = ref({});
	// Errors produced by form-level `rules`, keyed by field name.
	const formLevelErrors = ref({});
	// Overall submit result for form-wide live status feedback.
	const status = ref(null);

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

	// Whether formData has changed since the last (re)seed. Compares the live
	// reactive formData directly (not toRaw'd) so isEqual's internal property
	// reads go through the reactive proxy and are tracked as dependencies;
	// stripping reactivity first would hide nested edits like updateFieldValue,
	// which mutate a single property rather than reassigning formData.value.
	const isDirty = computed(() => !isEqual(formData.value, baseline.value));

	if (toValue(unsavedChangesGuard)) {
		// Warn on tab close/refresh while dirty. Browsers ignore the custom
		// message and show their own generic text regardless of returnValue's
		// content.
		function handleBeforeUnload(event) {
			if (!isDirty.value) {
				return;
			}

			event.preventDefault();
			event.returnValue = "";
		}

		window.addEventListener("beforeunload", handleBeforeUnload);

		// Contribute to the shared dirty-form count that
		// installUnsavedChangesGuard's router guard checks.
		watch(isDirty, (dirty) => {
			if (dirty) {
				registerDirtyForm();
			} else {
				unregisterDirtyForm();
			}
		});

		onUnmounted(() => {
			window.removeEventListener("beforeunload", handleBeforeUnload);

			if (isDirty.value) {
				unregisterDirtyForm();
			}
		});
	}

	// A bindable object for `v-bind="form"` on form-wrapper, packing the
	// v-model binding, rules, and submit handler into a single prop.
	// unsavedChangesGuard is included (unlike readonly/fieldTypes) because
	// form-wrapper spins up its own separate useForm instance in this pattern:
	// readonly/fieldTypes only ever affect rendering owned by that inner
	// instance regardless of what the outer instance holds, but
	// unsavedChangesGuard has a real external side effect (a beforeunload
	// listener, a shared dirty-form registry write) in both instances, so the
	// outer instance's setting must reach the inner one or an opt-out here
	// would silently only half-apply.
	const form = computed(() => ({
		modelValue: formData.value,
		"onUpdate:modelValue": (value) => {
			formData.value = value;
		},
		rules: toValue(rules),
		schema: toValue(schema),
		onSubmit,
		unsavedChangesGuard: toValue(unsavedChangesGuard),
	}));

	// Whether a recordId change is waiting for initialData/source to resolve to
	// that record's data before it can reseed. Set by the recordId watcher
	// below, cleared once the source watcher acts on it: this decouples "the
	// record changed" from "the new record's data has arrived," since an async
	// source (e.g. a query keyed on recordId) may not update in the same tick.
	const awaitingReseed = ref(false);

	// Seed our form data once, when it becomes available; reseed instead if a
	// recordId change is waiting on this source update.
	watch(
		source,
		(value) => {
			if (!value || (seeded.value && !awaitingReseed.value)) {
				return;
			}

			seed(value);
			awaitingReseed.value = false;
		},
		{ immediate: true },
	);

	// If there's a unique record ID which identifies the entity this form
	// represents, and it changes, and the user hasn't changed anything in the
	// form, flag that the next source update should reseed; never reseed here
	// directly, since the source may still hold the previous record's data.
	if (recordId !== undefined) {
		watch(toRef(recordId), (value, oldValue) => {
			if (!value || value === oldValue || isDirty.value) {
				return;
			}

			awaitingReseed.value = true;
		});
	}

	/**
	 * (Re)seed formData from a resolved initialData value, snapshotting the
	 * result as the new isDirty baseline.
	 *
	 * @param  {unknown}  value
	 *     The resolved initialData value to seed from.
	 */
	function seed(value) {
		seeded.value = true;

		const seededData = mapFormData(value, mapper);

		formData.value = seededData;
		baseline.value = structuredClone(toRaw(seededData));
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
	 * Validate a whole-object Standard Schema against the current form data,
	 * mapping each issue's path[0] to its field name.
	 */
	async function validateFormLevelSchema() {
		const currentSchema = toValue(schema);

		if (!isObject(currentSchema) || !isFunction(currentSchema["~standard"]?.validate)) {
			return {};
		}

		const result = await currentSchema["~standard"].validate(formData.value);
		const errors = {};

		if (!isNonEmptyArray(result?.issues)) {
			return errors;
		}

		for (const issue of result.issues) {
			const segment = issue.path?.[0];
			const fieldName = isObject(segment) ? segment.key : segment;

			if (!isNonEmptyString(fieldName)) {
				continue;
			}

			(errors[fieldName] ??= []).push(issue.message);
		}

		return errors;
	}

	/**
	 * Validate the form-level `rules` and whole-object `schema` against the
	 * current form data, merging both into a single per-field result: schema
	 * errors first, then keyed-rule errors, with duplicate messages removed.
	 */
	async function validateFormLevelRules() {
		const currentRules = toValue(rules);
		const schemaErrors = await validateFormLevelSchema();

		const ruleResults = isNonEmptyObject(currentRules)
			? (await validateForm(currentRules, formData.value)).results
			: {};

		const errors = {};
		const fieldNames = new Set([...Object.keys(schemaErrors), ...Object.keys(ruleResults)]);

		for (const fieldName of fieldNames) {
			const messages = [
				...(schemaErrors[fieldName] ?? []),
				...(ruleResults[fieldName]?.errors ?? []),
			];

			const deduped = [...new Set(messages)];

			if (isNonEmptyArray(deduped)) {
				errors[fieldName] = deduped;
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
		const submittedData = getSubmitData();

		status.value = null;
		isSubmitting.value = true;

		try {
			let result;

			try {
				result = await onSubmit?.(submittedData);
			} catch (error) {
				try {
					await handleSubmitError(error, submittedData);
				} finally {
					await unref(onSettled)?.(undefined, error, submittedData);
				}

				return;
			}

			status.value = { type: "success" };
			await unref(onSuccess)?.(result, submittedData);
			await unref(onSettled)?.(result, undefined, submittedData);
			clearPageTitle();
		} finally {
			resetSubmitButton();
		}
	}

	/**
	 * Handle a rejected submit Promise. If a `submitErrorsCallback` is provided
	 * and can map the error to field errors, surface those; otherwise re-throw.
	 *
	 * @param  {unknown}  error
	 * @param  {object}  [submittedData]
	 */
	async function handleSubmitError(error, submittedData = getSubmitData()) {
		await unref(onError)?.(error, submittedData);

		const callback = unref(submitErrorsCallback);

		if (!isFunction(callback)) {
			status.value = { type: "error", message: submitErrorMessage(error) };

			throw error;
		}

		const parsedErrors = callback(error);

		if (!isNonEmptyObject(parsedErrors)) {
			status.value = { type: "error", message: submitErrorMessage(error) };

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
		status,
		generalSubmitErrors,
		haveGeneralSubmitErrors,
		errorSummary,
		haveErrorSummary,
		isSubmitting,
		isReadonly,
		isDirty,
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
 * Get the message to show for an unhandled submit error.
 *
 * @param  {unknown}  error
 */
function submitErrorMessage(error) {
	if (isNonEmptyString(error?.message)) {
		return error.message;
	}

	return "Submit failed";
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
