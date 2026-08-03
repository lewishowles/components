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
			class="border-danger-subtle bg-danger-subtle text-danger mb-4 w-full rounded-sm border px-5 py-3"
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
					v-if="formStatus?.message"
					v-bind="{ type: formStatus.type, showIcon: false }"
					class="mb-4"
					data-test="form-wrapper-status"
				>
					<template v-if="Array.isArray(formStatus.message)">
						<p v-for="(message, index) in formStatus.message" :key="index">{{ message }}</p>
					</template>
					<template v-else>
						{{ formStatus.message }}
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
// fallow-ignore-file -- "submit" emit is used by consumers via `useForm` onSubmit callback, not directly within this component.
import {
	camelize,
	computed,
	getCurrentInstance,
	provide,
	ref,
	toRefs,
	toValue,
	useSlots,
	watch,
} from "vue";

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

const slots = useSlots();
const instance = getCurrentInstance();

// Whether the caller explicitly supplied an initial data source.
const haveInitialData = Object.keys(instance?.vnode.props ?? {}).some(
	(key) => camelize(key) === "initialData",
);

const submitButtonRef = ref(null);
const errorSummaryElement = ref(null);
const generalErrorsElement = ref(null);
const haveSubmitButtonLabel = computed(() => isNonEmptySlot(slots["submit-button-label"]));
const haveSubmitErrorsSlot = computed(() => isNonEmptySlot(slots["submit-errors"]));
const haveActionsLabel = computed(() => isNonEmptySlot(slots["actions-label"]));

// The source used to seed the form.
const formInitialData = computed(() => {
	return haveInitialData ? toValue(props.initialData) : props.modelValue;
});

/**
 * Call whatever `@submit` listener(s) the parent attached directly, so their
 * returned Promise can be awaited by useForm.
 *
 * @param  {object}  data
 * @returns {unknown}
 *     The first listener's resolved value, passed on to onSuccess as its
 *     submit result.
 */
async function callSubmitListeners(data) {
	const onSubmit = instance?.vnode.props?.onSubmit;
	const handlers = Array.isArray(onSubmit) ? onSubmit : [onSubmit].filter(Boolean);
	const results = await Promise.all(handlers.map((handler) => handler(data)));

	return results[0];
}

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
	updateFieldValue,
	fieldErrorsFor,
	handleFormSubmit,
	resetSubmitButton,
	focusField,
	isFieldRequired,
} = useForm({
	...toRefs(props),
	initialData: formInitialData,
	onSubmit: callSubmitListeners,
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
});

// Synchronous initial data seeds before this watcher exists, so emit its current value immediately.
watch(formData, (value) => emit("update:modelValue", value), {
	deep: true,
	immediate: haveInitialData && Boolean(formInitialData.value),
});

const isCompact = computed(() => props.compact);

// The prop overrides the engine's own submit-lifecycle status, for
// app-driven state (e.g. session expiry) unrelated to a submit outcome.
const formStatus = computed(() => props.status ?? submitStatus.value);

provide("form-wrapper", {
	fieldErrorsFor,
	registerField,
	updateFieldValue,
	isReadonly,
	isFieldRequired,
	isCompact,
});

defineExpose({ isSubmitting, isDirty, resetSubmitButton });
</script>
