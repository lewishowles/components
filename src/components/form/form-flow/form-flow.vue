<template>
	<form
		ref="form-flow"
		novalidate
		data-component="form-flow"
		data-test="form-flow"
		:aria-busy="isSubmitting"
		@submit.prevent="() => navigateForward()"
		@input="handleUserFieldInput"
		@change="handleUserFieldInput"
	>
		<form-error-summary
			ref="error-summary"
			v-bind="{
				errors: errorSummaryToDisplay,
				focusField,
				showErrors: haveAnyErrorSummary,
				testPrefix: 'form-flow',
			}"
			class="mbe-4"
		>
			<template #title>
				<slot name="error-summary-title">There is a problem</slot>
			</template>
		</form-error-summary>

		<div
			v-if="haveActiveScreen && !isShowingReview"
			class="border-border mbe-8 border-be pbe-10"
			data-part="progress"
			data-test="form-flow-progress"
		>
			<slot name="progress" v-bind="progressSlotProps">
				<step-indicator
					class="max-w-lg"
					v-bind="{ currentStep: activeScreenIndex + 1, stepCount: screenIds.length }"
				>
					{{ activeScreenProgressLabel || activeScreenId }}
				</step-indicator>
			</slot>
		</div>

		<div v-show="!isShowingReview" class="contents">
			<slot v-bind="{ activeScreenId, isSubmitting, hasErrors: haveAnyErrorSummary }" />
		</div>

		<section v-if="isShowingReview" data-part="review" data-test="form-flow-review">
			<h2
				ref="review-heading"
				class="text-content-strong mbe-6 text-2xl font-bold focus-visible:shadow-none focus-visible:outline-none"
				tabindex="-1"
				data-part="review-title"
				data-test="form-flow-review-title"
			>
				Review your answers
			</h2>

			<form-flow-review v-bind="{ summaries: answerSummaries }" @change="changeAnswer" />
		</section>

		<alert-message v-if="haveEmptyFlow" type="info" class="mbe-4" data-test="form-flow-empty">
			<slot name="empty">No screens are available.</slot>
		</alert-message>

		<form-actions v-if="haveActiveScreen" class="mt-12">
			<template v-if="haveActionsLabel" #label>
				<slot name="actions-label" />
			</template>

			<alert-message
				v-if="!haveSubmitButtonLabel"
				type="error"
				v-bind="{ live: false }"
				data-test="form-flow-submit-button-label-error"
			>
				<template #title>&lt;form-flow&gt;</template>

				<p>
					The slot
					<code>`submit-button-label`</code>
					is required to provide a meaningful call to action for the form.
				</p>
			</alert-message>

			<form-submit-feedback
				ref="general-errors"
				v-bind="{
					errors: generalSubmitErrors,
					showErrors: !haveFlowErrorSummary && (haveSubmitErrorsSlot || haveGeneralSubmitErrors),
					status: formStatus,
				}"
				test-prefix="form-flow"
			>
				<template #submit-errors>
					<slot name="submit-errors" v-bind="{ errors: generalSubmitErrors }" />
				</template>
			</form-submit-feedback>

			<ui-button
				v-if="showPrimaryButton"
				ref="submit-button"
				type="submit"
				v-bind="{ reactive: true }"
				class="button--primary"
				data-test="form-flow-continue-button"
			>
				<template v-if="isSubmitStep">
					<slot name="submit-button-label" />
				</template>
				<template v-else>
					<slot name="continue-label">Continue</slot>
				</template>
			</ui-button>

			<ui-button
				v-if="canGoBack"
				class="button--muted"
				type="button"
				data-test="form-flow-back-button"
				@click="navigateBack"
			>
				<slot name="back-label">Go back</slot>
			</ui-button>

			<slot name="secondary-actions" />

			<template #tertiary-actions>
				<slot name="tertiary-actions" />
			</template>
		</form-actions>
	</form>
</template>

<script setup>
import { computed, onMounted, provide, ref, toValue, unref, useTemplateRef, watch } from "vue";

import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useFormHost } from "@/composables/use-form-host/use-form-host.js";
import useFlowFocus from "./composables/use-flow-focus/use-flow-focus.js";
import useFlowNavigation from "./composables/use-flow-navigation/use-flow-navigation.js";
import useFlowScreens from "./composables/use-flow-screens/use-flow-screens.js";

// Reasons explain what caused each completed navigation reported by the
// `screen-change` event.
const navigationReasons = {
	AUTOMATIC: "automatic",
	BACK: "back",
	// The active conditional screen disappeared, so the flow moved to the next
	// or previous visible screen.
	CONDITIONAL_RECOVERY: "conditional-screen-recovery",
	CONTINUE: "continue",
	// Final validation found an error on another visible screen, so the flow
	// moved to that screen.
	FINAL_ERROR_RECOVERY: "final-error-recovery",
	// The first registered screen renders without a screen-change event or focus move.
	INITIAL_RENDER: "initial-render",
	REVIEW: "review",
};

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
	 * Called with the resolved submit result and submitted form data.
	 */
	onSuccess: {
		type: Function,
		default: null,
	},

	/**
	 * Called with a rejected submit error and submitted form data.
	 */
	onError: {
		type: Function,
		default: null,
	},

	/**
	 * Called after every submit attempt with its result, error, and form data.
	 */
	onSettled: {
		type: Function,
		default: null,
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
	},

	/**
	 * Additional classes passed to every screen's own form-layout, merged via
	 * `cn` to resolve Tailwind conflicts. Useful for overriding the default
	 * gap on compact forms.
	 */
	layoutClasses: {
		type: String,
		default: "",
	},

	/**
	 * Shows a review screen summarising every answer before the flow submits,
	 * instead of submitting straight from the final screen.
	 */
	enableReview: {
		type: Boolean,
		default: false,
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
	 * Settings for each field, keyed by field name. An entry can hold `options` for
	 * option-backed fields, a `valueType` that converts the field's value, or `rules`
	 * that apply while the field belongs to a screen still in the flow. A setting
	 * passed directly to `form-field` takes precedence over its entry here. When the
	 * `rules` prop also names the field, the `rules` prop's rules run first.
	 */
	fields: {
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

const emit = defineEmits(["screen-change", "submit", "update:modelValue"]);

// References used to scroll the flow and manage focus or submit-button state.
const formFlow = useTemplateRef("form-flow");
const errorSummaryElement = useTemplateRef("error-summary");
const generalErrorsElement = useTemplateRef("general-errors");
const submitButtonRef = useTemplateRef("submit-button");
// Focus target for the review screen's heading when review opens.
const reviewHeading = useTemplateRef("review-heading");

// Whether the primary action button should render for the current step.
const showPrimaryButton = computed(
	() =>
		!isLastScreen.value ||
		(props.enableReview && !isShowingReview.value) ||
		haveSubmitButtonLabel.value,
);

// Whether the primary action submits the flow instead of continuing to another screen.
const isSubmitStep = computed(
	() => isShowingReview.value || (isLastScreen.value && !props.enableReview),
);

// The screen whose content is currently rendered.
const activeScreenId = ref(null);
// Whether the review screen is showing in place of the active screen's content.
const isShowingReview = ref(false);

// The screen list is set up before the form, because the form asks it which
// fields are still on a screen. The form's field functions and the navigation
// actions don't exist yet, so they are passed as wrappers that look them up
// when called.
const {
	activeScreenIndex,
	activeScreenProgressLabel,
	canGoBack,
	haveActiveScreen,
	haveActiveScreenErrors,
	haveEmptyFlow,
	isCurrentScreen,
	isLastScreen,
	isScreenComplete,
	markScreenComplete,
	progressSlotProps,
	registerFlowField,
	registerScreen,
	screenFieldNames,
	screenFieldNamesById,
	screenIds,
	screens,
	unregisterFlowField,
	unregisterScreen,
} = useFlowScreens({
	activeScreenId,
	fieldErrorsFor: (name) => fieldErrorsFor(name),
	invalidatePendingNavigation: () => navigation.invalidatePendingNavigation(),
	isShowingReview,
	navigateToScreen: (...args) => navigation.navigateToScreen(...args),
	navigationReasons,
	registerField: (field) => registerField(field),
	unregisterField: (name) => unregisterField(name),
});

const {
	formData,
	errorSummary,
	haveErrorSummary,
	formLevelErrors,
	submitErrors,
	generalSubmitErrors,
	haveGeneralSubmitErrors,
	isSubmitting,
	isReadonly,
	isDirty,
	formFields,
	status: submitStatus,
	registerField,
	unregisterField,
	updateFieldValue,
	fieldErrorsFor,
	normaliseFieldErrors,
	handleFormSubmit,
	resetSubmitButton,
	focusField,
	isFieldRequired,
	validate,
	formContext,
	formStatus,
	haveSubmitButtonLabel,
	haveSubmitErrorsSlot,
	haveActionsLabel,
} = useFormHost(props, emit, {
	includeUnregisteredFields: true,
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
	handleEmptySubmit,
	// A field keeps its rules from the fields setting while it belongs to any
	// screen still in the flow.
	isFieldPresent: (name) =>
		screenIds.value.some((screenId) => screens.value[screenId]?.fields?.includes(name)),
});

// Errors that cannot be attributed to a field on a visible screen.
const flowErrorSummary = ref([]);
// Whether the flow-level error summary has messages to show.
const haveFlowErrorSummary = computed(() => isNonEmptyArray(flowErrorSummary.value));
// Whether the current screen's field errors or the flow-level summary has
// messages to show.
const haveAnyErrorSummary = computed(() => haveErrorSummary.value || haveFlowErrorSummary.value);

// The error summary to render: flow-level errors take priority over the
// current screen's own summary.
const errorSummaryToDisplay = computed(() => {
	return haveFlowErrorSummary.value ? flowErrorSummary.value : errorSummary.value;
});

// Moves focus and scrolls the page after each screen change or flow error.
// Navigation calls these actions.
const focusHooks = useFlowFocus({
	activeScreenId,
	errorSummaryElement,
	flowErrorSummary,
	focusField,
	formFields,
	formFlow,
	haveAnyErrorSummary,
	isShowingReview,
	navigationReasons,
	reviewHeading,
	screens,
});

// Screen navigation, validation on Continue, and auto-advance for the flow.
const navigation = useFlowNavigation({
	activeScreenId,
	activeScreenIndex,
	canGoBack,
	emit,
	enableReview: () => props.enableReview,
	fieldErrors: () => props.fieldErrors,
	fieldErrorsFor,
	flowErrorSummary,
	focusHooks,
	formData,
	formLevelErrors,
	handleFormSubmit,
	haveActiveScreen,
	haveActiveScreenErrors,
	haveEmptyFlow,
	isLastScreen,
	isShowingReview,
	isSubmitting,
	markScreenComplete,
	navigationReasons,
	normaliseFieldErrors,
	resetSubmitButton,
	screenFieldNames,
	screenFieldNamesById,
	screenIds,
	screens,
	submitErrors,
	updateFieldValue,
	validate,
});

// The navigation actions the template and the fields' form context call.
const {
	changeAnswer,
	handleUserFieldInput,
	navigateBack,
	navigateForward,
	updateFieldValueAndAutoAdvance,
} = navigation;

// Every completed screen's answers, in screen order, for the review screen.
const answerSummaries = computed(() => getAnswerSummaries());

// Warn when screen registration changes leave no visible screen.
watch(haveEmptyFlow, warnIfEmptyFlow);

// Once mounted, let user changes auto-advance the flow, and warn when there are
// no screens to register.
onMounted(() => {
	navigation.enableAutoAdvance();
	warnIfEmptyFlow();
});

/**
 * Emit the flow submit event when no direct listener is attached.
 *
 * @param  {object}  data
 *     The form data ready to be submitted.
 */
function handleEmptySubmit(data) {
	emit("submit", data);
}

/**
 * Build the answer summary for every registered screen, for the review screen.
 *
 * @returns  {object[]}
 *     One summary per registered screen, in registration order.
 */
function getAnswerSummaries() {
	const summaries = [];

	for (const screenId of screenIds.value) {
		const screen = screens.value[screenId];

		if (!screen) {
			continue;
		}

		const fields = [];

		for (const fieldName of screen.fields ?? []) {
			const field = screen.answerFields?.[fieldName];
			const displayValue = unref(field?.displayValue);

			const hasDisplayableAnswer = displayValue !== undefined || Boolean(field?.answerSummary);
			const label = toValue(field?.label);
			const hasFieldLabel = isNonEmptyString(label);

			if (!hasDisplayableAnswer || !hasFieldLabel) {
				continue;
			}

			fields.push({
				answer: displayValue,
				answerSummary: field.answerSummary,
				fieldName,
				label,
			});
		}

		if (fields.length > 0) {
			summaries.push({
				fields,
				id: screenId,
				title: unref(screen.label) || screenId,
			});
		}
	}

	return summaries;
}

// Warn in development when no screen is available to display.
function warnIfEmptyFlow() {
	if (!haveEmptyFlow.value || !import.meta.env.DEV) {
		return;
	}

	console.warn("[form-flow] No visible screens remain.");
}

provide("form-flow", {
	isCurrentScreen,
	isScreenComplete,
	layoutClasses: computed(() => props.layoutClasses),
	registerScreen,
	unregisterScreen,
});

provide("form", {
	...formContext,
	registerField: registerFlowField,
	unregisterField: unregisterFlowField,
	updateFieldValue: updateFieldValueAndAutoAdvance,
});

/**
 * Set a named field value from outside the form flow without changing completion
 * or triggering automatic progression.
 *
 * @param  {string}  name
 *     The field name.
 * @param  {unknown}  value
 *     The value to store for the field.
 */
async function setValue(name, value) {
	await updateFieldValueAndAutoAdvance(name, value);
}

defineExpose({ isSubmitting, isDirty, activeScreenId, resetSubmitButton, setValue });
</script>
