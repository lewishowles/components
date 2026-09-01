<template>
	<form
		novalidate
		data-component="form-wrapper"
		data-test="form-wrapper"
		:aria-busy="isSubmitting"
		@submit.prevent="handleFormSubmit"
	>
		<form-error-summary
			ref="errorSummaryElement"
			v-bind="{
				errors: errorSummary,
				focusField,
				showErrors: haveErrorSummary,
				testPrefix: 'form-wrapper',
			}"
			class="mb-4"
		>
			<template #title>
				<slot name="error-summary-title">There is a problem</slot>
			</template>
		</form-error-summary>

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

				<form-submit-feedback
					ref="generalErrorsElement"
					v-bind="{
						errors: generalSubmitErrors,
						showErrors: haveSubmitErrorsSlot || haveGeneralSubmitErrors,
						status: formStatus,
					}"
					test-prefix="form-wrapper"
				>
					<template #submit-errors>
						<slot name="submit-errors" v-bind="{ errors: generalSubmitErrors }" />
					</template>
				</form-submit-feedback>

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
// fallow-ignore-file -- "submit" emit is used by consumers via `useForm`
// onSubmit callback, not directly within this component.
import { provide, ref } from "vue";

import { useFormHost } from "@/composables/use-form-host/use-form-host.js";

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
	 * form should not handle; they are re-thrown.
	 */
	submitErrorsCallback: {
		type: Function,
		default: null,
	},

	/**
	 * Called with onSubmit's resolved return value and the submitted form
	 * data once a submit succeeds. Use for side effects such as a success
	 * message, closing a modal, or navigating away.
	 */
	onSuccess: {
		type: Function,
		default: null,
	},

	/**
	 * Called with onSubmit's rejection error and the submitted form data
	 * when a submit fails. Use to log the error or show a fallback message
	 * for failures that submitErrorsCallback can't map to a field.
	 */
	onError: {
		type: Function,
		default: null,
	},

	/**
	 * Called with the submit result, error, and submitted form data after
	 * every submit attempt, regardless of outcome.
	 */
	onSettled: {
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
	 * A whole-object Standard Schema (e.g. Zod, Valibot) validated against the
	 * full form data, in addition to rules. Both run together and merge into
	 * one per-field result. A whole-object schema can't express cross-field
	 * constraints (same, required_if, different, custom); use rules for those.
	 */
	schema: {
		type: Object,
		default: null,
	},

	/**
	 * Form-wide status feedback displayed near the submit button. Defaults to
	 * useForm's own submit-lifecycle status (success/error), so most forms need
	 * not set this. Pass a value to override with app-driven state such as a
	 * permission error or session expiry, which takes precedence until cleared.
	 * For specific submission failures, use submitErrorsCallback.
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
	 * Prefix added to document.title after failed validation.
	 */
	pageTitleErrorPrefix: {
		type: String,
		default: "Error:",
	},

	/**
	 * When true, all child form-field components become readonly. Use for
	 * review-mode or read-only forms where the user should not edit values.
	 */
	readonly: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether this form should guard against losing unsaved changes: warn on
	 * tab close/refresh while dirty, and contribute to the shared dirty-form
	 * count that installUnsavedChangesGuard's router guard checks. Set to
	 * false for trivial forms where the guard would be unwanted noise.
	 */
	unsavedChangesGuard: {
		type: Boolean,
		default: true,
	},

	/**
	 * When true, reduces vertical spacing in the form layout and fieldset
	 * headings. Cascades automatically to form-layout and form-fieldset via
	 * provide; no prop needed on child components.
	 */
	compact: {
		type: Boolean,
		default: false,
	},

	/**
	 * Field type transformations applied to initial and submitted form data,
	 * keyed by field name. Each value is one of "nullable-number" or
	 * "nullable-string".
	 */
	fieldTypes: {
		type: Object,
		default: () => ({}),
	},

	/**
	 * An object or getter used to seed this form once it resolves. When omitted,
	 * modelValue remains the seed source.
	 */
	initialData: {
		type: [Object, Function],
		default: null,
	},

	/**
	 * The stable identifier for the record that identifies the contents of this
	 * form. When the record ID changes to a new truthy value, a clean form
	 * waits for `initialData` to resolve and reseeds. A dirty form keeps its
	 * edits until they are saved or discarded.
	 */
	recordId: {
		type: [String, Number],
		default: null,
	},

	/**
	 * The form's field values. Seeded once from the initial value passed in;
	 * later changes to this prop from outside the form are not reflected.
	 */
	modelValue: {
		type: Object,
		default: () => ({}),
	},
});

// "submit" is emitted by the consumer's `useForm` onSubmit callback, not
// directly within this component.
const emit = defineEmits(["update:modelValue", "submit"]);

const submitButtonRef = ref(null);
const errorSummaryElement = ref(null);
const generalErrorsElement = ref(null);

const {
	formData,
	errorSummary,
	haveErrorSummary,
	generalSubmitErrors,
	haveGeneralSubmitErrors,
	isSubmitting,
	isReadonly,
	isDirty,
	status: submitStatus,
	registerField,
	unregisterField,
	updateFieldValue,
	fieldErrorsFor,
	handleFormSubmit,
	resetSubmitButton,
	focusField,
	isFieldRequired,
	formContext,
	formStatus,
	haveSubmitButtonLabel,
	haveSubmitErrorsSlot,
	haveActionsLabel,
} = useFormHost(props, emit, {
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
});

provide("form", formContext);

/**
 * Set a named field value from outside the form.
 *
 * @param  {string}  name
 *     The field name.
 * @param  {unknown}  value
 *     The value to store for the field.
 */
async function setValue(name, value) {
	await updateFieldValue(name, value);
}

defineExpose({ isSubmitting, isDirty, resetSubmitButton, setValue });
</script>
