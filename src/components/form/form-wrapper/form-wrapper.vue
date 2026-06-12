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

				<alert-message v-if="haveSubmitErrorsSlot || haveGeneralSubmitErrors" type="error">
					<slot name="submit-errors" v-bind="{ errors: generalSubmitErrors }">
						<ul v-if="generalSubmitErrors.length > 1" class="list-disc ps-4">
							<li v-for="(error, index) in generalSubmitErrors" :key="index">
								{{ error }}
							</li>
						</ul>
						<p v-else>{{ generalSubmitErrors[0] }}</p>
					</slot>
				</alert-message>

				<slot name="messages" />

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
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";

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
// A holding pot for any validation errors found during validation.
const validationErrorSummary = ref([]);
// Errors produced by the `submitErrorsCallback` from a rejected submit.
const submitErrors = ref({});

// Parent-owned field errors formatted for the error summary.
const externalErrorSummary = computed(() => {
	const errors = [];

	for (const fieldName in formFields) {
		if (!Object.hasOwn(formFields, fieldName)) {
			continue;
		}

		getFieldErrors(fieldName).forEach((message) => {
			errors.push({ fieldName, id: formFields[fieldName].id, message });
		});
	}

	return errors;
});

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

// All field errors shown in the error summary.
const errorSummary = computed(() => [
	...validationErrorSummary.value,
	...externalErrorSummary.value,
]);

// Whether our error summary contains any errors.
const haveErrorSummary = computed(() => isNonEmptyArray(errorSummary.value));
// The error summary element, allowing us to focus it.
const errorSummaryElement = ref(null);
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
	getFieldErrors,
	registerField,
	updateFieldValue,
});

watch(
	() => props.fieldErrors,
	async () => {
		if (!isNonEmptyArray(externalErrorSummary.value)) {
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
	// Clear any errors from a previous submit so stale errors don't block this
	// attempt or linger in the summary.
	submitErrors.value = {};

	if (!haveFormFields.value) {
		await doSubmit();

		return;
	}

	validateFields();

	if (haveErrorSummary.value) {
		resetSubmitButton();
		await focusErrorSummary();

		return;
	}

	await doSubmit();
}

/**
 * Validate each field based on its provided validation function. If any errors
 * are encountered, populate the `errorSummary`.
 */
function validateFields() {
	validationErrorSummary.value = [];

	for (const fieldName in formFields) {
		if (!Object.hasOwn(formFields, fieldName)) {
			continue;
		}

		const field = formFields[fieldName];

		if (!isFunction(field.validateField)) {
			continue;
		}

		const validationResult = field.validateField(fieldName, formData.value);

		if (!isNonEmptyArray(validationResult)) {
			continue;
		}

		validationResult.forEach((message) => {
			validationErrorSummary.value.push({ fieldName, id: field.id, message });
		});
	}
}

/**
 * Get all error messages for a field, combining parent-owned errors with any
 * produced by the `submitErrorsCallback`.
 *
 * @param  {string}  fieldName
 *     The field to retrieve error messages for.
 */
function getFieldErrors(fieldName) {
	return [
		...normaliseFieldErrors(props.fieldErrors?.[fieldName]),
		...normaliseFieldErrors(submitErrors.value?.[fieldName]),
	];
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

	runComponentMethod(errorSummaryElement.value, "focus");
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
	} catch (error) {
		await handleSubmitError(error);
	} finally {
		resetSubmitButton();
	}
}

/**
 * Handle a rejected submit Promise. If a `fieldErrorsCallback` is provided and
 * can map the error to field errors, surface those; otherwise re-throw so
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

	await focusErrorSummary();
}

/**
 * Reset the submit button's loading state. Called automatically when the
 * parent's submit handler Promise settles, or can be called manually as a
 * fallback.
 */
function resetSubmitButton() {
	isSubmitting.value = false;

	runComponentMethod(submitButtonRef.value, "reset");
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

	runComponentMethod(formFields[fieldName], "triggerFocus");
}

defineExpose({ isSubmitting, resetSubmitButton });
</script>
