<template>
	<form
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

		<div v-show="!isShowingReview" class="contents">
			<slot v-bind="{ isSubmitting, hasErrors: haveAnyErrorSummary }" />
		</div>

		<section
			v-if="isShowingReview"
			class="border-border mbs-8 border-bs pbs-6"
			data-part="review"
			data-test="form-flow-review"
		>
			<h2
				ref="review-heading"
				class="text-content-strong mbe-6 text-2xl font-bold"
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

		<div
			v-if="haveActiveScreen && !isShowingReview"
			class="border-border mbs-12 border-bs pbs-3"
			data-part="progress"
			data-test="form-flow-progress"
		>
			<slot name="progress" v-bind="progressSlotProps">
				<step-indicator
					v-bind="{ currentStep: activeScreenIndex + 1, stepCount: screenIds.length }"
				>
					{{ activeScreenProgressLabel || activeScreenId }}
				</step-indicator>
			</slot>
		</div>
	</form>
</template>

<script setup>
import {
	computed,
	getCurrentInstance,
	nextTick,
	onMounted,
	provide,
	ref,
	toRefs,
	toValue,
	unref,
	useSlots,
	useTemplateRef,
	watch,
} from "vue";

import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { toCamelCase } from "@lewishowles/helpers/string";
import { until } from "@vueuse/core";

import { useForm } from "@/composables/use-form/use-form.js";

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

const instance = getCurrentInstance();
const slots = useSlots();

// Whether the caller supplied initialData, so its default value can be distinguished.
const haveInitialData = Object.keys(instance?.vnode.props ?? {}).some(
	(key) => toCamelCase(key) === "initialData",
);

// The source used to seed the form.
const formInitialData = computed(() => {
	return haveInitialData ? toValue(props.initialData) : props.modelValue;
});

// References used by useForm for focus and submit-button state.
const errorSummaryElement = useTemplateRef("error-summary");
const generalErrorsElement = useTemplateRef("general-errors");
const submitButtonRef = useTemplateRef("submit-button");
// Focus target for the review screen's heading when review opens.
const reviewHeading = useTemplateRef("review-heading");

// The form-wide status prop overrides submit lifecycle status when provided.
const formStatus = computed(() => props.status ?? submitStatus.value);
// Whether the final screen has a meaningful submit label.
const haveSubmitButtonLabel = computed(() => isNonEmptySlot(slots["submit-button-label"]));

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

// Whether the actions group has an accessible label.
const haveActionsLabel = computed(() => isNonEmptySlot(slots["actions-label"]));
// Whether custom submit errors should render without parsed errors.
const haveSubmitErrorsSlot = computed(() => isNonEmptySlot(slots["submit-errors"]));

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
} = useForm({
	...toRefs(props),
	initialData: formInitialData,
	onSubmit: callSubmitListeners,
	includeUnregisteredFields: true,
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
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

// Screen IDs, kept in order so that screen navigation makes sense.
const screenIds = ref([]);
// Per-screen state. Keep slotOrder when a screen unregisters so it can return
// to its original position; the other values reset when it unregisters.
const screens = ref({});
// The screen whose content is currently rendered.
const activeScreenId = ref(null);
// Whether the review screen is showing in place of the active screen's content.
const isShowingReview = ref(false);

// Do not auto-advance while initial data is being applied.
let isAutoAdvanceReady = false;
// Native input/change events are the only signal that a model watcher update
// came from the user. Keep that signal until the watcher consumes it.
let hasUserInputEvent = false;
// Automatic validation can finish after a newer change or navigation. Keep the
// latest request so an older result cannot move the flow.
let latestAutoAdvanceRequest = null;
// A focus lookup can outlive the screen visit that started it. Keep the visit
// identity so an older lookup cannot steal focus after the user returns.
let currentFocusRequest = null;
// The field a review Change button asked to focus, until the next focus attempt consumes it.
let pendingFieldFocus = null;

// Use the registered screen IDs to determine the current navigation position.
const activeScreenIndex = computed(() => screenIds.value.indexOf(activeScreenId.value));
// Whether the flow has no screen left to display.
const haveEmptyFlow = computed(() => screenIds.value.length === 0);
// Whether a screen is available to render.
const haveActiveScreen = computed(() => !haveEmptyFlow.value && activeScreenIndex.value >= 0);
// The label for the screen currently shown in the default progress display.
const activeScreenProgressLabel = computed(() => getScreenProgress(activeScreenId.value).label);
// Every completed screen's answers, in screen order, for the review screen.
const answerSummaries = computed(() => getAnswerSummaries());

// Screen labels and completion state for a custom progress display.
const progressSlotProps = computed(() => ({
	current: getScreenProgress(activeScreenId.value),
	completed: screenIds.value
		.filter((screenId) => screens.value[screenId]?.completed)
		.map((screenId) => getScreenProgress(screenId)),
	remaining: screenIds.value
		.slice(activeScreenIndex.value + 1)
		.map((screenId) => getScreenProgress(screenId)),
}));

// Whether the current screen is the last registered screen.
const isLastScreen = computed(
	() => haveActiveScreen.value && activeScreenIndex.value === screenIds.value.length - 1,
);

// Whether the Back action can move to an earlier screen.
const canGoBack = computed(() => isShowingReview.value || activeScreenIndex.value > 0);

// Field names retained by each currently visible screen.
const screenFieldNamesById = computed(() => {
	const namesByScreen = {};

	for (const screenId of screenIds.value) {
		const fieldNames = screens.value[screenId]?.fields;

		if (fieldNames) {
			namesByScreen[screenId] = [...fieldNames];
			continue;
		}

		namesByScreen[screenId] = [];
	}

	return namesByScreen;
});

// Field names retained by every currently visible screen, in screen order.
const screenFieldNames = computed(() => [
	...new Set(Object.values(screenFieldNamesById.value).flat()),
]);

// Whether the active screen has a field error after validation.
const haveActiveScreenErrors = computed(() =>
	(screenFieldNamesById.value[activeScreenId.value] ?? []).some(
		(fieldName) => fieldErrorsFor(fieldName).length > 0,
	),
);

// Synchronous initial data seeds before this watcher exists, so emit its
// current value immediately.
watch(formData, (value) => emit("update:modelValue", value), {
	deep: true,
	immediate: haveInitialData && Boolean(formInitialData.value),
});

// Warn when screen registration changes leave no visible screen.
watch(haveEmptyFlow, warnIfEmptyFlow);

// Focus the destination after Vue has mounted its screen and registered fields.
watch(
	activeScreenId,
	(destinationScreenId) => {
		if (!isNonEmptyString(destinationScreenId)) {
			return;
		}

		focusPendingField(destinationScreenId);
	},
	{ flush: "post" },
);

// Warn when the flow mounts without any screens to register.
onMounted(() => {
	isAutoAdvanceReady = true;
	warnIfEmptyFlow();
});

/**
 * Call whatever `@submit` listener(s) the parent attached directly, so their
 * returned Promise can be awaited by useForm.
 *
 * @param  {object}  data
 *     The form data ready to be submitted.
 * @returns  {unknown}
 *     The first listener's resolved value, passed on to onSuccess as its
 *     submit result.
 */
async function callSubmitListeners(data) {
	const onSubmit = instance?.vnode.props?.onSubmit;
	const handlers = Array.isArray(onSubmit) ? onSubmit : [onSubmit].filter(Boolean);

	if (handlers.length === 0) {
		emit("submit", data);

		return undefined;
	}

	const results = await Promise.all(handlers.map((handler) => handler(data)));

	return results[0];
}

/**
 * Return a screen's ID and its concise label.
 *
 * @param  {string}  screenId
 *     The screen ID.
 * @returns  {object}
 *     The screen ID and its plain-text label.
 */
function getScreenProgress(screenId) {
	const screenLabel = unref(screens.value[screenId]?.label);

	return {
		id: screenId,
		label: screenLabel || screenId,
	};
}

/**
 * Register a screen wherever it appears in the default slot.
 *
 * @param  {object}  screen
 *     The screen ID and its plain-text label.
 * @param  {string}  screen.id
 *     The screen ID.
 * @param  {ComputedRef<string | undefined>}  screen.label
 *     The concise label used by progress displays and answer summaries.
 * @param  {string}  screen.autoAdvance
 *     The field name that triggers automatic progression on a direct user change.
 * @param  {string}  screen.autoFocus
 *     The field name to focus on entry.
 * @param  {object}  screen.element
 *     The screen root ref used to find its title after it renders.
 */
function registerScreen({ autoAdvance, autoFocus, element, id: screenId, label } = {}) {
	if (!isNonEmptyString(screenId) || screenIds.value.includes(screenId)) {
		return;
	}

	if (!screens.value[screenId]) {
		screens.value[screenId] = {
			slotOrder: Object.values(screens.value).length,
			completed: false,
		};
	}

	// Re-insert the screen in its original position, if it had one, based on
	// its `slotOrder`, stored in `screens`.
	const screen = screens.value[screenId];

	screen.answerFields ??= {};
	screen.fields ??= [];

	screen.label = label;
	screen.autoAdvance = autoAdvance;
	screen.autoFocus = autoFocus;
	screen.element = element;

	const insertionIndex = screenIds.value.findIndex(
		(registeredScreenId) => screens.value[registeredScreenId]?.slotOrder > screen.slotOrder,
	);

	screenIds.value.splice(
		insertionIndex === -1 ? screenIds.value.length : insertionIndex,
		0,
		screenId,
	);

	if (!isNonEmptyString(activeScreenId.value)) {
		navigateToScreen(screenId, {
			direction: "forward",
			reason: navigationReasons.INITIAL_RENDER,
			shouldEmitChange: false,
		});
	}
}

/**
 * Remove a screen, preserve its original slot order for later reappearance,
 * and choose the nearest remaining screen if the removed screen was active.
 *
 * @param  {string}  screenId
 *     The screen ID.
 */
function unregisterScreen(screenId) {
	const screenIndex = screenIds.value.indexOf(screenId);

	if (screenIndex === -1) {
		return;
	}

	const wasActive = isCurrentScreen(screenId);

	screenIds.value.splice(screenIndex, 1);

	const screen = screens.value[screenId];

	if (screen) {
		// Keep slotOrder so a reappearing screen is reinserted at its original position.
		screens.value[screenId] = { slotOrder: screen.slotOrder };
	}

	if (!wasActive) {
		return;
	}

	// A screen can disappear while its answers are showing in the review
	// screen; fall back to a neighbouring screen, or close review if none remain.
	if (isShowingReview.value) {
		const destinationScreenId =
			screenIds.value[screenIndex] ?? screenIds.value[screenIndex - 1] ?? null;

		if (destinationScreenId) {
			activeScreenId.value = destinationScreenId;
		} else {
			isShowingReview.value = false;
			activeScreenId.value = null;
		}

		return;
	}

	// Fall back to the screen sharing the index this screen had (the next
	// screen), or the previous screen.
	const destinationScreenId =
		screenIds.value[screenIndex] ?? screenIds.value[screenIndex - 1] ?? null;

	if (destinationScreenId) {
		navigateToScreen(destinationScreenId, {
			direction: screenIndex < screenIds.value.length ? "forward" : "backward",
			reason: navigationReasons.CONDITIONAL_RECOVERY,
		});
	} else {
		// The removed screen must not regain focus or navigate when its async work
		// finishes. Clear the active ID so a later screen becomes the first screen.
		latestAutoAdvanceRequest = null;
		currentFocusRequest = null;
		activeScreenId.value = null;
	}
}

/**
 * Check whether a screen is currently active.
 *
 * @param  {string}  screenId
 *     The screen ID registered with the flow.
 * @returns {boolean}
 *     Whether the screen should render its content.
 */
function isCurrentScreen(screenId) {
	return activeScreenId.value === screenId;
}

/**
 * Check whether a screen passed validation when moving forward.
 *
 * @param  {string}  screenId
 *     The screen ID registered with the flow.
 * @returns {boolean}
 *     Whether the screen is complete.
 */
function isScreenComplete(screenId) {
	return Boolean(screens.value[screenId]?.completed);
}

/**
 * Mark a screen complete after it passes validation when moving forward.
 *
 * @param  {string}  screenId
 *     The screen ID registered with the flow.
 */
function markScreenComplete(screenId) {
	if (!screenIds.value.includes(screenId) || isScreenComplete(screenId)) {
		return;
	}

	screens.value[screenId].completed = true;
}

/**
 * Clear completion for a screen and every later registered screen.
 *
 * @param  {string}  screenId
 *     The registered screen ID whose value changed.
 */
function resetCompletionStartingAtScreen(screenId) {
	const screenIndex = screenIds.value.indexOf(screenId);

	if (screenIndex === -1) {
		return;
	}

	for (const completedScreenId of screenIds.value.slice(screenIndex)) {
		screens.value[completedScreenId].completed = false;
	}
}

/**
 * Register a field with the form and record which screen owns it, so
 * final validation can route an error back to its screen even after the
 * field's own component unmounts.
 *
 * @param  {object}  field
 *     The field registration supplied by form-field.
 * @param  {string}  field.label
 *     The field's label text.
 * @param  {ComputedRef<unknown>}  field.displayValue
 *     The display value available for answer summaries, or undefined when omitted.
 * @param  {Function}  field.answerSummary
 *     The field's custom renderer for its answer in a summary, if provided.
 */
function registerFlowField(field) {
	const registration = registerField(field);

	if (!isNonEmptyString(activeScreenId.value) || !isNonEmptyString(field.name)) {
		return registration;
	}

	const fieldNames = screens.value[activeScreenId.value]?.fields ?? [];

	if (!fieldNames.includes(field.name)) {
		fieldNames.push(field.name);
	}

	screens.value[activeScreenId.value].fields = fieldNames;

	screens.value[activeScreenId.value].answerFields[field.name] = {
		answerSummary: field.answerSummary,
		displayValue: field.displayValue,
		label: field.label,
	};

	return registration;
}

/**
 * Remove a field from its screen or freeze its last answer-summary value.
 * While the screen is still active, a disappearing field was renamed or
 * conditionally removed, so its screen entry is pruned. Once the screen has
 * been left, freeze the last known value so earlier answers remain available
 * after the field unmounts.
 *
 * @param  {string}  fieldName
 *     The name of the field being unregistered.
 */
function unregisterFlowField(fieldName) {
	const ownerScreenId = screenIds.value.find((candidate) =>
		screens.value[candidate]?.fields?.includes(fieldName),
	);

	if (isNonEmptyString(ownerScreenId)) {
		const screen = screens.value[ownerScreenId];

		// If this field belongs to the active screen, it's been conditionally
		// hidden, so we remove it entirely.
		if (ownerScreenId === activeScreenId.value) {
			screen.fields = screen.fields.filter((name) => name !== fieldName);

			delete screen.answerFields[fieldName];
		} else {
			// Otherwise, we keep its last answer.
			const answerField = screen.answerFields?.[fieldName];

			if (answerField) {
				screen.answerFields[fieldName] = {
					answerSummary: answerField.answerSummary,
					displayValue: unref(answerField.displayValue),
					label: answerField.label,
				};
			}
		}
	}

	unregisterField(fieldName);
}

/**
 * Build the answer summary for every completed screen, for the review screen.
 *
 * @returns  {object[]}
 *     One summary per completed screen, in registration order.
 */
function getAnswerSummaries() {
	const summaries = [];

	for (const screenId of screenIds.value) {
		const screen = screens.value[screenId];

		if (!screen?.completed) {
			continue;
		}

		const fields = [];

		for (const fieldName of screen.fields ?? []) {
			const field = screen.answerFields?.[fieldName];
			const displayValue = unref(field?.displayValue);

			const hasDisplayableAnswer = displayValue !== undefined || Boolean(field?.answerSummary);
			const hasFieldLabel = isNonEmptyString(field?.label);

			if (!hasDisplayableAnswer || !hasFieldLabel) {
				continue;
			}

			fields.push({
				answer: displayValue,
				answerSummary: field.answerSummary,
				fieldName,
				label: field.label,
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

/**
 * Record that the next field update came from a native input or change event.
 */
function handleUserFieldInput() {
	hasUserInputEvent = true;
}

/**
 * Update a field value, clear completion for its screen and following
 * screens, and start automatic progression when the change came directly
 * from the user.
 *
 * @param  {string}  name
 *     The field name.
 * @param  {unknown}  value
 *     The new field value.
 */
async function updateFieldValueAndClearCompletion(name, value) {
	const previousValue = formData.value?.[name];
	const wasUserInput = hasUserInputEvent;

	hasUserInputEvent = false;

	await updateFieldValue(name, value);

	if (Object.is(previousValue, value)) {
		return;
	}

	const screenId = screenIds.value.find((candidate) =>
		screens.value[candidate]?.fields?.includes(name),
	);

	if (screenId) {
		resetCompletionStartingAtScreen(screenId);
	}

	if (wasUserInput) {
		startAutoAdvance(name);
	}
}

/**
 * Start validation for a screen's configured field after a direct user change.
 *
 * @param  {string}  fieldName
 *     The field name that changed.
 */
function startAutoAdvance(fieldName) {
	const sourceScreenId = activeScreenId.value;

	if (
		!isAutoAdvanceReady ||
		!isNonEmptyString(sourceScreenId) ||
		screens.value[sourceScreenId]?.autoAdvance !== fieldName
	) {
		return;
	}

	const autoAdvanceRequest = Symbol("auto-advance-request");

	latestAutoAdvanceRequest = autoAdvanceRequest;

	void navigateForward({
		reason: navigationReasons.AUTOMATIC,
		isRequestStillCurrent: () => latestAutoAdvanceRequest === autoAdvanceRequest,
	});
}

/**
 * Find errors whose field name is not registered to a screen, so they can be
 * shown as flow-level errors instead of being routed to a screen.
 *
 * @returns {object[]}
 *     Flow-level error summary entries.
 */
function getFlowLevelErrors() {
	const registeredFieldNames = new Set(screenFieldNames.value);
	const flowErrors = [];
	const seenErrorKeys = new Set();
	const errorSources = [formLevelErrors.value, submitErrors.value, props.fieldErrors];

	for (const source of errorSources) {
		for (const [fieldName, value] of Object.entries(source ?? {})) {
			if (registeredFieldNames.has(fieldName)) {
				continue;
			}

			for (const message of normaliseFieldErrors(value)) {
				const errorKey = `${fieldName}:${message}`;

				if (seenErrorKeys.has(errorKey)) {
					continue;
				}

				seenErrorKeys.add(errorKey);
				flowErrors.push({ fieldName: null, id: null, message });
			}
		}
	}

	return flowErrors;
}

/**
 * Find the first visible screen with a field error, checking screens in their
 * current order.
 *
 * @returns {object|null}
 *     The screen ID and field name for the first error, or null when no
 *     visible screen has a field error.
 */
function getFirstErrorScreen() {
	for (const screenId of screenIds.value) {
		const fieldNames = screenFieldNamesById.value[screenId] ?? [];

		for (const fieldName of fieldNames) {
			if (fieldErrorsFor(fieldName).length > 0) {
				return { fieldName, screenId };
			}
		}
	}

	return null;
}

/**
 * Set the visible screen and report the change.
 *
 * @param  {string}  destinationScreenId
 *     The screen to display.
 * @param  {object}  options
 *     Navigation direction and reason.
 * @param  {string}  options.direction
 *     Whether the destination screen is ahead of or behind the source screen.
 * @param  {boolean}  options.shouldEmitChange
 *     Whether to emit `screen-change`; false for registration-time navigation
 *     that has no prior screen to report leaving.
 * @param  {string}  options.reason
 *     The screen-change reason to report.
 */
function navigateToScreen(
	destinationScreenId,
	{ direction = "forward", shouldEmitChange = true, reason } = {},
) {
	// Manual or conditional navigation invalidates automatic validation still in flight.
	latestAutoAdvanceRequest = null;

	if (!isNonEmptyString(destinationScreenId) || !screenIds.value.includes(destinationScreenId)) {
		return;
	}

	const sourceScreenId = activeScreenId.value;

	if (sourceScreenId === destinationScreenId) {
		void focusScreen(destinationScreenId);

		return;
	}

	activeScreenId.value = destinationScreenId;

	// The screen being left may still have a focus attempt in flight (e.g.
	// waiting on a field to register). Invalidate it now, synchronously, rather
	// than waiting for the post-navigation watcher to call focusScreen and
	// replace the token; that watcher runs later, leaving a gap where the
	// stale attempt would still read as current.
	currentFocusRequest = null;

	if (shouldEmitChange && isNonEmptyString(sourceScreenId)) {
		emit("screen-change", {
			destinationId: destinationScreenId,
			direction,
			reason,
			sourceId: sourceScreenId,
		});
	}
}

/**
 * Find a screen's rendered heading element, once its content has mounted.
 *
 * @param  {string}  screenId
 *     The destination screen ID.
 * @returns {Element|null}
 *     The screen heading, when the screen is rendered.
 */
function getScreenHeading(screenId) {
	const screenElement = toValue(screens.value[screenId]?.element);

	return screenElement?.querySelector?.('[data-part="title"]') ?? null;
}

/**
 * Move focus to the shared error-summary box once its current content
 * (the current screen's own errors, or flow-level errors) has rendered.
 *
 * @param  {object}  [focusRequest]
 *     The focus attempt this call belongs to. Omit when calling outside a
 *     tracked focus attempt (e.g. showing a flow-level error directly), which
 *     always proceeds.
 */
async function focusErrorSummaryBox(focusRequest) {
	await nextTick();

	// If a later focus attempt has started, this one is stale; cancel it.
	if (focusRequest && focusRequest !== currentFocusRequest) {
		return;
	}

	errorSummaryElement.value?.focus?.();
}

/**
 * Move focus to a field once it has registered, since a screen renders
 * before its field completes registration in a later update.
 *
 * @param  {string}  fieldName
 *     The field name to focus.
 * @param  {object}  focusRequest
 *     The focus attempt this call belongs to.
 * @returns {boolean}
 *     Whether the field was focused.
 */
async function focusRegisteredField(fieldName, focusRequest) {
	if (!isNonEmptyString(fieldName)) {
		return false;
	}

	if (!formFields[fieldName]) {
		await until(() => formFields[fieldName]).toBeTruthy({
			timeout: 1000,
			throwOnTimeout: false,
		});
	}

	// If we can't find the field, or a later focus attempt has started, cancel.
	if (!formFields[fieldName] || focusRequest !== currentFocusRequest) {
		return false;
	}

	focusField(fieldName);

	return true;
}

/**
 * Focus a screen after its content and errors have rendered.
 *
 * @param  {string}  screenId
 *     The screen whose summary, requested field, auto-focus field, or title should receive focus.
 * @param  {object}  options
 *     Focus options for this attempt.
 * @param  {string}  options.fieldName
 *     A field to focus instead of the screen's own auto-focus field, set by a review Change button.
 */
async function focusScreen(screenId = activeScreenId.value, { fieldName } = {}) {
	// Leaving and quickly returning to the same screen can start a second focus
	// attempt before the first one's await resolves. Give this attempt its own
	// identity so an earlier attempt can tell it has been superseded and stop
	// instead of moving focus after this one already has.
	const focusRequest = Symbol("focus-request");

	currentFocusRequest = focusRequest;

	await nextTick();

	// If a later focus attempt has started, this one is stale; cancel it.
	if (focusRequest !== currentFocusRequest) {
		return;
	}

	// If we have an error summary, focus it.
	if (haveAnyErrorSummary.value) {
		await focusErrorSummaryBox(focusRequest);

		return;
	}

	// The review screen has no per-field target; focus its own heading.
	if (isShowingReview.value) {
		reviewHeading.value?.focus?.();

		return;
	}

	const screen = screens.value[screenId];

	if (!screen) {
		return;
	}

	const autoFocus = isNonEmptyString(fieldName) ? fieldName : screen.autoFocus;

	// Attempt to focus the listed field.
	if (isNonEmptyString(autoFocus)) {
		if (await focusRegisteredField(autoFocus, focusRequest)) {
			return;
		}

		// If a later focus attempt has started, this one is stale; cancel it.
		if (focusRequest !== currentFocusRequest) {
			return;
		}
	}

	// Fall back to focusing the header of the screen.
	const heading = getScreenHeading(screenId);

	heading?.focus?.();
}

/**
 * Show flow-level errors and move focus to their summary.
 *
 * @param  {object[]}  errors
 *     Flow-level error summary entries.
 */
async function showFlowErrors(errors) {
	flowErrorSummary.value = errors;

	await focusErrorSummaryBox();
}

/**
 * Open the review screen over the active screen's content, or do nothing when
 * review is disabled or the flow has no screens.
 */
function navigateToReview() {
	if (!props.enableReview || haveEmptyFlow.value) {
		return;
	}

	isShowingReview.value = true;
	void focusScreen();
}

/**
 * After final validation, navigate to the first visible screen with an
 * error, or show any unowned error as a flow-level error.
 */
async function showFinalErrors() {
	const firstErrorScreen = getFirstErrorScreen();

	if (firstErrorScreen) {
		// Close review so the screen owning the error is visible when navigated to.
		isShowingReview.value = false;
		flowErrorSummary.value = [];

		const destinationIndex = screenIds.value.indexOf(firstErrorScreen.screenId);

		navigateToScreen(firstErrorScreen.screenId, {
			direction: destinationIndex > activeScreenIndex.value ? "forward" : "backward",
			reason: navigationReasons.FINAL_ERROR_RECOVERY,
		});

		return;
	}

	const flowErrors = getFlowLevelErrors();

	if (flowErrors.length > 0) {
		await showFlowErrors(flowErrors);
	}
}

/**
 * Move to the previous screen, skipping validation on the current screen.
 */
function navigateBack() {
	// Back from review closes it and returns to the screen behind it.
	if (isShowingReview.value) {
		isShowingReview.value = false;
		flowErrorSummary.value = [];
		void focusScreen();

		return;
	}

	if (!canGoBack.value) {
		return;
	}

	navigateToScreen(screenIds.value[activeScreenIndex.value - 1], {
		direction: "backward",
		reason: navigationReasons.BACK,
	});

	flowErrorSummary.value = [];
}

/**
 * Focus the field a review Change button requested, once its screen is active.
 * Clears the pending request first so a later navigation can't reuse it.
 *
 * @param  {string}  screenId
 *     The screen the requested field belongs to.
 */
function focusPendingField(screenId) {
	const fieldName = pendingFieldFocus;

	pendingFieldFocus = null;

	void focusScreen(screenId, { fieldName });
}

/**
 * Leave the review screen for a field's owning screen and focus that field,
 * called when a review Change button is activated.
 *
 * @param  {object}  selection
 *     The field selected from the review screen.
 * @param  {string}  selection.screenId
 *     The screen that registered the field.
 * @param  {string}  selection.fieldName
 *     The field to focus once its screen is active.
 */
function changeAnswer({ fieldName, screenId } = {}) {
	if (
		!isNonEmptyString(screenId) ||
		!isNonEmptyString(fieldName) ||
		!screenIds.value.includes(screenId)
	) {
		return;
	}

	pendingFieldFocus = fieldName;
	isShowingReview.value = false;

	// The active screen won't change, so the activeScreenId watcher never
	// fires for it; focus the target directly instead.
	if (screenId === activeScreenId.value) {
		focusPendingField(screenId);

		return;
	}

	const destinationIndex = screenIds.value.indexOf(screenId);

	// Changing activeScreenId is what triggers the activeScreenId watcher,
	// which focuses the target once the destination screen is current.
	navigateToScreen(screenId, {
		direction: destinationIndex > activeScreenIndex.value ? "forward" : "backward",
		reason: navigationReasons.REVIEW,
	});
}

/**
 * Validate the visible screen before moving forward or submitting the flow.
 *
 * @param  {object}  options
 *     The navigation reason and optional check for the latest automatic validation.
 * @param  {string}  options.reason
 *     The screen-change reason to report; defaults to a manual Continue.
 * @param  {function}  options.isRequestStillCurrent
 *     Returns whether this navigation attempt hasn't been superseded by a
 *     newer one; defaults to always current for manual navigation.
 */
async function navigateForward(options = {}) {
	const reason = options?.reason ?? navigationReasons.CONTINUE;
	const isRequestStillCurrent = options?.isRequestStillCurrent ?? (() => true);

	if (!haveActiveScreen.value || isSubmitting.value) {
		return;
	}

	// Wait a tick so the latest field change has settled into formData before validating.
	await nextTick();

	flowErrorSummary.value = [];

	if (isLastScreen.value) {
		await submitFinalScreen({ isRequestStillCurrent, reason });

		return;
	}

	await continueToNextScreen({ isRequestStillCurrent, reason });
}

/**
 * Handle reaching the final screen: submit it, or open review instead when
 * review is enabled and not yet showing.
 *
 * @param  {object}  options
 *     The current automatic-navigation check and screen-change reason.
 * @param  {function}  options.isRequestStillCurrent
 *     Required. Returns whether this navigation attempt hasn't been
 *     superseded by a newer one; supplied by navigateForward().
 * @param  {string}  options.reason
 *     The screen-change reason to report when review validation fails.
 */
async function submitFinalScreen({ isRequestStillCurrent, reason }) {
	// Review already validated the final screen when it opened, so a submit
	// from review and a direct final-screen submit share the same path.
	if (isShowingReview.value || !props.enableReview) {
		await submitAndFinalise(activeScreenId.value, { isRequestStillCurrent });

		return;
	}

	// Review defers final submission: validate the final screen, then open
	// review instead of submitting.
	await validate({ focus: false });

	if (!isRequestStillCurrent()) {
		return;
	}

	const flowErrors = getFlowLevelErrors();

	if (isNonEmptyArray(flowErrors)) {
		await showFlowErrors(flowErrors);

		return;
	}

	if (haveActiveScreenErrors.value) {
		navigateToScreen(activeScreenId.value, { reason });

		return;
	}

	markScreenComplete(activeScreenId.value);
	navigateToReview();
	resetSubmitButton();
}

/**
 * Validate a non-final screen and advance to the next one once it is valid.
 *
 * @param  {object}  options
 *     The current automatic-navigation check and screen-change reason.
 * @param  {function}  options.isRequestStillCurrent
 *     Required. Returns whether this navigation attempt hasn't been
 *     superseded by a newer one; supplied by navigateForward().
 * @param  {string}  options.reason
 *     The screen-change reason to report after validation succeeds.
 */
async function continueToNextScreen({ isRequestStillCurrent, reason }) {
	// Validate the current screen's fields plus any root-level rule. Only the
	// active screen's fields are mounted, and form-field unregisters them on
	// unmount, so formFields and validate() see no inactive-screen fields.
	await validate({ focus: false });

	if (!isRequestStillCurrent()) {
		return;
	}

	const flowErrors = getFlowLevelErrors();

	if (isNonEmptyArray(flowErrors)) {
		await showFlowErrors(flowErrors);

		return;
	}

	if (haveActiveScreenErrors.value) {
		navigateToScreen(activeScreenId.value, { reason });

		return;
	}

	markScreenComplete(activeScreenId.value);
	navigateToScreen(screenIds.value[activeScreenIndex.value + 1], {
		direction: "forward",
		reason,
	});

	resetSubmitButton();
}

/**
 * Run final submission and mark the given screen complete once it succeeds
 * with no screen-owned or flow-level errors.
 *
 * @param  {string}  screenIdToComplete
 *     The screen to mark complete after a successful submission.
 * @param  {object}  options
 *     The current automatic-navigation check.
 * @param  {function}  options.isRequestStillCurrent
 *     Required. Returns whether this navigation attempt hasn't been
 *     superseded by a newer one; supplied by navigateForward().
 */
async function submitAndFinalise(screenIdToComplete, { isRequestStillCurrent }) {
	await handleFormSubmit({
		focus: false,
		scoped: false,
	});

	if (!isRequestStillCurrent()) {
		return;
	}

	await showFinalErrors();

	// Final completion requires no screen-owned error and no flow-level error.
	if (!getFirstErrorScreen() && getFlowLevelErrors().length === 0) {
		markScreenComplete(screenIdToComplete);
	}
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
	fieldErrorsFor,
	registerField: registerFlowField,
	unregisterField: unregisterFlowField,
	updateFieldValue: updateFieldValueAndClearCompletion,
	isReadonly,
	isFieldRequired,
	isCompact: computed(() => props.compact),
});

defineExpose({ isSubmitting, isDirty, resetSubmitButton });
</script>
