<template>
	<form
		novalidate
		data-component="form-wrapper"
		data-test="form-wrapper"
		:aria-busy="isSubmitting"
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
import { computed, getCurrentInstance, provide, ref, useSlots } from "vue";

import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { useForm } from "@/composables/use-form/use-form.js";

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

	/**
	 * When true, all child form-field components become readonly. Use for
	 * review-mode or read-only forms where the user should not edit values.
	 */
	readonly: {
		type: Boolean,
		default: false,
	},

	/**
	 * When true, reduces vertical spacing in the form layout and fieldset
	 * headings. Cascades automatically to form-layout and form-fieldset via
	 * provide — no prop needed on child components.
	 */
	compact: {
		type: Boolean,
		default: false,
	},
});

defineEmits(["submit"]);

const slots = useSlots();
const instance = getCurrentInstance();

const submitButtonRef = ref(null);
const errorSummaryElement = ref(null);
const generalErrorsElement = ref(null);

const haveSubmitButtonLabel = computed(() => isNonEmptySlot(slots["submit-button-label"]));
const haveSubmitErrorsSlot = computed(() => isNonEmptySlot(slots["submit-errors"]));
const haveActionsLabel = computed(() => isNonEmptySlot(slots["actions-label"]));

const formData = defineModel({
	type: Object,
	default: () => ({}),
});

const {
	errorSummary,
	haveErrorSummary,
	generalSubmitErrors,
	haveGeneralSubmitErrors,
	isSubmitting,
	isReadonly,
	registerField,
	updateFieldValue,
	fieldErrorsFor,
	handleFormSubmit,
	resetSubmitButton,
	focusField,
	isFieldRequired,
} = useForm({
	formData,
	props,
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
	instance,
});

const isCompact = computed(() => props.compact);

provide("form-wrapper", {
	fieldErrorsFor,
	registerField,
	updateFieldValue,
	isReadonly,
	isFieldRequired,
	isCompact,
});

defineExpose({ isSubmitting, resetSubmitButton });
</script>
