<template>
	<form
		novalidate
		data-component="form-wrapper"
		data-test="form-wrapper"
		@submit.prevent="handleFormSubmit"
	>
		<div
			v-show="haveErrorSummary"
			ref="errorSummaryElement"
			tabindex="0"
			class="mb-4 w-full rounded-sm border border-red-200 bg-red-50 px-5 py-3 text-red-800 dark:border-transparent dark:bg-red-500/50 dark:text-red-200"
			data-test="form-wrapper-error-summary"
		>
			<h2 class="mb-2 font-bold">
				<slot name="error-summary-title">There is a problem</slot>
			</h2>

			<ul class="list-disc ps-4">
				<li v-for="(error, index) in errorSummary" :key="`${error.id}-${index}`">
					<a
						:href="`#${error.id}`"
						class="text-current"
						data-test="form-wrapper-error-summary-message"
						@click.prevent="focusField(error.fieldName)"
					>
						{{ error.message }}
					</a>
				</li>
			</ul>
		</div>

		<slot name="pre-form" />

		<form-layout v-bind="{ class: layoutClasses }">
			<slot v-bind="{ isSubmitting, hasErrors: haveErrorSummary }" />

			<form-actions>
				<template v-if="haveActionsLabel" #label>
					<slot name="actions-label" />
				</template>

				<alert-message
					v-if="!haveSubmitButtonLabel"
					type="error"
					v-bind="{ live: false }"
					data-test="form-wrapper-submit-button-label-error"
				>
					<template #title>&lt;form-wrapper&gt;</template>

					<p>
						The slot
						<code>`submit-button-label`</code>
						is required to provide a meaningful call to action for the form.
					</p>
				</alert-message>

				<alert-message
					v-if="haveSubmitErrorsSlot || haveGeneralSubmitErrors"
					ref="generalErrorsElement"
					type="error"
					data-test="form-wrapper-general-errors"
				>
					<slot name="submit-errors" v-bind="{ errors: generalSubmitErrors }">
						<ul v-if="generalSubmitErrors.length > 1" class="list-disc ps-4">
							<li v-for="(error, index) in generalSubmitErrors" :key="index">
								{{ error }}
							</li>
						</ul>
						<p v-else>{{ generalSubmitErrors[0] }}</p>
					</slot>
				</alert-message>

				<alert-message
					v-if="status"
					v-bind="{ type: status.type, showIcon: false }"
					class="mb-4"
					data-test="form-wrapper-status"
				>
					<template v-if="Array.isArray(status.message)">
						<p v-for="(message, index) in status.message" :key="index">{{ message }}</p>
					</template>
					<template v-else>
						{{ status.message }}
					</template>
				</alert-message>

				<ui-button
					v-if="haveSubmitButtonLabel"
					ref="submitButtonRef"
					type="submit"
					v-bind="{ reactive: true }"
					class="button--primary"
					data-test="form-wrapper-submit-button"
				>
					<slot name="submit-button-label" />
				</ui-button>

				<slot name="secondary-actions" />

				<template #tertiary-actions>
					<slot name="tertiary-actions" />
				</template>
			</form-actions>
		</form-layout>
	</form>
</template>

<script setup>
import {
	computed,
	getCurrentInstance,
	nextTick,
	provide,
	reactive,
	ref,
	useSlots,
	watch,
} from "vue";

import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject, isObject } from "@lewishowles/helpers/object";
import { isNonEmptySlot, callComponentMethod } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { validateField as validateFormField } from "@lewishowles/helpers/form";

const props = defineProps({
	/**
	 * Field-level errors managed by the parent, usually from an API response.
	 * Each value can be a single message or a list of messages.
	 */
	fieldErrors: {
		type: Object,
		default: () => ({}),
	},

	/**
	 * An optional method that maps a rejected submit Promise into an errors
	 * object. Keys matching registered fields are shown as field errors; other
	 * keys are surfaced as general errors. Return an empty value for errors the
	 * form should not handle — they are re-thrown.
	 */
	submitErrorsCallback: {
		type: Function,
		default: null,
	},

	/**
	 * Additional classes to pass to the inner form-layout, merged via `cn` to
	 * resolve Tailwind conflicts. Useful for overriding the default gap on
	 * compact forms.
	 */
	layoutClasses: {
		type: String,
		default: "",
	},

	/**
	 * Form-level validation rules, keyed by field name. Each value is an array
	 * of rules in the same shape as `form-field`'s own `validation`, but run
	 * against the full form data on submit. This is useful both for keeping
	 * validation contained and not spread across fields, but it also allows
	 * validation that relies on other fields.
	 */
	rules: {
		type: Object,
		default: () => ({}),
	},

	/**
	 * Form-wide status feedback displayed near the submit button in an
	 * accessible live region. Use for overall form state such as success
	 * confirmation, permission errors, or session expiry. For specific
	 * submission failures, use submitErrorsCallback.
	 */
	status: {
		type: Object,
		default: null,
		// Shape: { type: 'success' | 'error' | 'info', message: string | string[] }
	},

	/**
	 * Whether failed validation prefixes the page title with
	 * pageTitleErrorPrefix. Disable when using router-managed or app-level
	 * title handling.
	 */
	updatePageTitleOnError: {
		type: Boolean,
		default: true,
	},

	/**
	 * Prefix added to document.title after failed validation. Localisable.
	 */
	pageTitleErrorPrefix: {
		type: String,
		default: "Error:",
	},
});

defineEmits(["submit"]);

const slots = useSlots();
// The component instance, used to access the parent's submit handler for Promise tracking.
const instance = getCurrentInstance();
// A ref to the submit button, allowing us to control its loading state.
const submitButtonRef = ref(null);
// Determine if we have a label. If not, show a warning to the user about
// accessibility.
const haveSubmitButtonLabel = computed(() => isNonEmptySlot(slots["submit-button-label"]));
// Whether a custom submit-errors slot has been provided.
const haveSubmitErrorsSlot = computed(() => isNonEmptySlot(slots["submit-errors"]));
// Whether a label has been provided for the actions group.
const haveActionsLabel = computed(() => isNonEmptySlot(slots["actions-label"]));

// The current data for this form, as provided by the fields themselves.
const formData = defineModel({
	type: Object,
	default: () => ({}),
});

// A reference to each of our form fields once registered.
const formFields = reactive({});
// Whether we have any form fields registered to the form.
const haveFormFields = computed(() => isNonEmptyObject(formFields));
// Field-local validation errors, keyed by field name. Each value is an array
// of error message strings. Populated during submit from each field's
// validateField method.
const fieldValidationErrors = ref({});
// Errors produced by the `submitErrorsCallback` from a rejected submit.
const submitErrors = ref({});
// Errors produced by form-level `rules`, keyed by field name. Populated on
// submit and surfaced through `fieldErrorsFor` so they display beside the field
// and in the error summary.
const formLevelErrors = ref({});

// Parsed submit errors whose key doesn't match a registered field, surfaced as
// general errors rather than field errors.
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
// The error summary element, allowing us to focus it.
const errorSummaryElement = ref(null);
// The general errors container, allowing us to focus it when only general
// errors are present.
const generalErrorsElement = ref(null);
// Whether a form submission is currently in progress.
const isSubmitting = ref(false);

/**
 * Allow a field to register itself with the form.
 *
 * @param  {string}  field.name
 *     The name of the field to register.
 * @param  {string}  field.id
 *     The ID of the field to register, which helps with linking errors to
 *     fields.
 * @param  {function}  field.validateField
 *     The validation function for this field, run when the form is submitted.
 * @param  {function}  field.triggerFocus
 *     A method to focus on this field, used by the error summary.
 */
async function registerField(field) {
	// If the value bound to the model from the parent isn't an object, set it
	// to one, and wait for the update cycle to complete to ensure that both
	// values are in sync.
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
 * @param  {string}  name
 *     The name of the field to update.
 * @param  {unknown}  value
 *     The value to set.
 */
async function updateFieldValue(name, value) {
	formData.value[name] = value;
}

provide("form-wrapper", {
	fieldErrorsFor,
	registerField,
	updateFieldValue,
});

watch(
	() => props.fieldErrors,
	async () => {
		if (!isNonEmptyArray(errorSummary.value)) {
			return;
		}

		await focusErrorSummary();
	},
	{ deep: true },
);

/**
 * Handle the submit of the form, checking any provided validation, and
 * submitting the appropriate event if validation succeeds.
 */
async function handleFormSubmit() {
	// Clear all wrapper-owned errors so stale errors don't block this attempt
	// or linger in the summary.
	submitErrors.value = {};
	fieldValidationErrors.value = {};
	formLevelErrors.value = {};

	if (!haveFormFields.value) {
		await doSubmit();

		return;
	}

	await validateFields();
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
 * Validate each field based on its provided validation function, storing
 * results in fieldValidationErrors keyed by field name.
 */
async function validateFields() {
	const errors = {};

	for (const fieldName in formFields) {
		if (!Object.hasOwn(formFields, fieldName)) {
			continue;
		}

		const field = formFields[fieldName];

		if (!isFunction(field.validateField)) {
			continue;
		}

		const validationResult = await field.validateField(fieldName, formData.value);

		if (!isNonEmptyArray(validationResult)) {
			continue;
		}

		errors[fieldName] = validationResult;
	}

	fieldValidationErrors.value = errors;
}

/**
 * Validate the form-level `rules` against the current form data, mapping any
 * errors to their field name. Field-local validation runs first, so these
 * append after a field's own messages in both the field display and the error
 * summary. Re-runs from scratch on each submit so resolved errors clear.
 */
async function validateFormLevelRules() {
	const errors = {};

	if (isNonEmptyObject(props.rules)) {
		for (const fieldName in props.rules) {
			if (!Object.hasOwn(props.rules, fieldName)) {
				continue;
			}

			const fieldRules = props.rules[fieldName];

			if (!isNonEmptyArray(fieldRules)) {
				continue;
			}

			const { errors: fieldErrors } = await validateFormField(
				fieldName,
				fieldRules,
				formData.value,
			);

			if (isNonEmptyArray(fieldErrors)) {
				errors[fieldName] = fieldErrors;
			}
		}
	}

	formLevelErrors.value = errors;
}

/**
 * Get all error messages for a field, combining field-local validation,
 * parent-owned, submit callback, and form-level rule errors with deduplication.
 * This is the single merge point for all field error sources.
 *
 * @param  {string}  fieldName
 *     The field to retrieve error messages for.
 */
function fieldErrorsFor(fieldName) {
	const seen = new Set();

	return [
		...normaliseFieldErrors(fieldValidationErrors.value[fieldName]),
		...normaliseFieldErrors(props.fieldErrors?.[fieldName]),
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
 * Normalise a field's error value, which may be a single message or a list,
 * into an array of non-empty messages.
 *
 * @param  {string|Array}  value
 *     The raw error value for a field.
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

	callComponentMethod(errorSummaryElement.value, "focus");
}

/**
 * Focus the general errors container so keyboard users land at the feedback
 * after a failed submit with no field errors.
 */
async function focusGeneralErrors() {
	await nextTick();

	callComponentMethod(generalErrorsElement.value, "focus");
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
 * Add the error prefix to the page title after a failed submit. Does not
 * duplicate an existing prefix.
 */
function updatePageTitle() {
	if (!props.updatePageTitleOnError) {
		return;
	}

	const prefix = `${props.pageTitleErrorPrefix} `;

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

	document.title = document.title.slice(props.pageTitleErrorPrefix.length + 1);
	prefixedPageTitle.value = null;
}

/**
 * Call the parent's submit handlers directly, tracking any returned Promise to
 * auto-reset the submit button when the async work settles. Mirrors the
 * loadingAuto pattern from ui-button.
 */
async function doSubmit() {
	isSubmitting.value = true;

	const onSubmit = instance?.vnode.props?.onSubmit;
	const handlers = Array.isArray(onSubmit) ? onSubmit : [onSubmit].filter(Boolean);

	try {
		await Promise.all(handlers.map((handler) => handler(formData.value)));
		clearPageTitle();
	} catch (error) {
		await handleSubmitError(error);
	} finally {
		resetSubmitButton();
	}
}

/**
 * Handle a rejected submit Promise. If a `submitErrorsCallback` is provided
 * and can map the error to field errors, surface those; otherwise re-throw so
 * general failures still reach the parent app.
 *
 * @param  {unknown}  error
 *     The error the submit Promise rejected with.
 */
async function handleSubmitError(error) {
	if (!isFunction(props.submitErrorsCallback)) {
		throw error;
	}

	const parsedErrors = props.submitErrorsCallback(error);

	if (!isNonEmptyObject(parsedErrors)) {
		throw error;
	}

	submitErrors.value = parsedErrors;

	await focusAfterFailedSubmit();
}

/**
 * Reset the submit button's loading state. Called automatically when the
 * parent's submit handler Promise settles, or can be called manually as a
 * fallback.
 */
function resetSubmitButton() {
	isSubmitting.value = false;

	callComponentMethod(submitButtonRef.value, "reset");
}

/**
 * Trigger focus on the underlying form field.
 *
 * @param  {string}  fieldName
 *     The name of the field to focus.
 */
function focusField(fieldName) {
	if (!Object.hasOwn(formFields, fieldName)) {
		return;
	}

	callComponentMethod(formFields[fieldName], "triggerFocus");
}

defineExpose({ isSubmitting, resetSubmitButton, fieldValidationErrors });
</script>
