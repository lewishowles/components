<template>
	<form
		novalidate
		data-component="form-flow"
		data-test="form-flow"
		:aria-busy="isSubmitting"
		@submit.prevent="handleContinue"
	>
		<div
			v-show="haveAnyErrorSummary"
			ref="error-summary"
			tabindex="0"
			class="border-danger-subtle bg-danger-subtle text-danger mb-4 w-full rounded-sm border px-5 py-3"
			data-test="form-flow-error-summary"
		>
			<h2 class="mb-2 font-bold">
				<slot name="error-summary-title">There is a problem</slot>
			</h2>

			<ul class="list-disc ps-4">
				<li v-for="(error, index) in errorSummaryToDisplay" :key="`${error.id}-${index}`">
					<a
						v-if="error.id"
						:href="`#${error.id}`"
						class="text-current"
						data-test="form-flow-error-summary-message"
						@click.prevent="focusField(error.fieldName)"
					>
						{{ error.message }}
					</a>
					<span v-else>{{ error.message }}</span>
				</li>
			</ul>
		</div>

		<slot v-bind="{ isSubmitting, hasErrors: haveAnyErrorSummary }" />

		<alert-message v-if="haveEmptyFlow" type="info" class="mb-4" data-test="form-flow-empty">
			<slot name="empty">No screens are available.</slot>
		</alert-message>

		<alert-message
			v-if="haveGeneralSubmitErrors && !haveFlowErrorSummary"
			ref="general-errors"
			type="error"
			data-test="form-flow-general-errors"
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
			data-test="form-flow-status"
		>
			<template v-if="Array.isArray(formStatus.message)">
				<p v-for="(message, index) in formStatus.message" :key="index">{{ message }}</p>
			</template>
			<template v-else>
				{{ formStatus.message }}
			</template>
		</alert-message>

		<form-actions>
			<ui-button
				v-if="canGoBack"
				type="button"
				data-test="form-flow-back-button"
				@click="handleBack"
			>
				<slot name="back-label">Back</slot>
			</ui-button>

			<ui-button
				v-if="haveCurrentScreen"
				ref="submit-button"
				type="submit"
				v-bind="{ reactive: true }"
				class="button--primary"
				data-test="form-flow-continue-button"
			>
				<template v-if="isLastScreen">
					<slot name="submit-button-label" />
				</template>
				<template v-else>
					<slot name="continue-label">Continue</slot>
				</template>
			</ui-button>
		</form-actions>
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
	useSlots,
	useTemplateRef,
	watch,
} from "vue";

import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { toCamelCase } from "@lewishowles/helpers/string";
import { until } from "@vueuse/core";
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

const emit = defineEmits(["update:modelValue", "submit"]);

const slots = useSlots();
const instance = getCurrentInstance();

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

// The form-wide status prop overrides submit lifecycle status when provided.
const formStatus = computed(() => props.status ?? submitStatus.value);

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
// Fields linked to their screen.
const screenFields = ref({});
// The screen whose content is currently rendered.
const activeScreenId = ref(null);
// Use the registered screen IDs to determine the current navigation position.
const activeScreenIndex = computed(() => screenIds.value.indexOf(activeScreenId.value));
// Whether a screen is available to render.
const haveCurrentScreen = computed(() => activeScreenIndex.value >= 0);
// Whether the flow has no screen left to display.
const haveEmptyFlow = computed(() => screenIds.value.length === 0);

// Whether the current screen is the last registered screen.
const isLastScreen = computed(
	() => haveCurrentScreen.value && activeScreenIndex.value === screenIds.value.length - 1,
);

// Whether the Back action can move to an earlier screen.
const canGoBack = computed(() => activeScreenIndex.value > 0);

// Field names retained by each currently visible screen.
const screenFieldNamesById = computed(() => {
	const namesByScreen = {};

	for (const screenId of screenIds.value) {
		const fieldNames = screenFields.value[screenId];

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

// Whether the current screen has a field error after validation.
const haveCurrentScreenErrors = computed(() =>
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

// Warn when the flow mounts without any screens to register.
onMounted(warnIfEmptyFlow);

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
 * Register a screen wherever it appears in the default slot.
 *
 * @param  {string}  screenId
 *     The screen ID.
 */
function registerScreen(screenId) {
	// We use a unique array, rather than a Set, to provide order-preserving
	// indexOf and splice.
	if (!isNonEmptyString(screenId) || screenIds.value.includes(screenId)) {
		return;
	}

	screenIds.value.push(screenId);

	if (!screenFields.value[screenId]) {
		screenFields.value[screenId] = [];
	}

	if (!isNonEmptyString(activeScreenId.value)) {
		activeScreenId.value = screenId;
	}
}

/**
 * Remove a screen and choose the nearest remaining screen if the removed screen
 * was active.
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

	delete screenFields.value[screenId];

	if (!wasActive) {
		return;
	}

	// Fall back to the screen sharing the index this screen had (the next
	// screen), or the previous screen.
	activeScreenId.value = screenIds.value[screenIndex] ?? screenIds.value[screenIndex - 1] ?? null;
}

/**
 * Check whether a screen is currently active.
 *
 * @param  {string}  screenId
 *     The stable screen ID.
 * @returns {boolean}
 *     Whether the screen should render its content.
 */
function isCurrentScreen(screenId) {
	return activeScreenId.value === screenId;
}

/**
 * Register a field with the form and record which screen owns it, so
 * final validation can route an error back to its screen even after the
 * field's own component unmounts.
 *
 * @param  {object}  field
 *     The field registration supplied by form-field.
 */
function registerFlowField(field) {
	registerField(field);

	if (!isNonEmptyString(activeScreenId.value) || !isNonEmptyString(field.name)) {
		return;
	}

	const names = screenFields.value[activeScreenId.value] ?? [];

	if (!names.includes(field.name)) {
		names.push(field.name);
	}

	screenFields.value[activeScreenId.value] = names;
}

/**
 * Find form-level and submit errors whose field name does not belong to any
 * currently visible screen, so they can be shown as flow-level errors
 * instead of being routed to a screen.
 *
 * @returns {object[]}
 *     Flow-level error summary entries.
 */
function getFlowErrors() {
	const knownFieldNames = new Set(screenFieldNames.value);
	const errors = [];
	const seen = new Set();
	const errorSources = [formLevelErrors.value, submitErrors.value, props.fieldErrors];

	for (const source of errorSources) {
		for (const [fieldName, value] of Object.entries(source ?? {})) {
			if (knownFieldNames.has(fieldName)) {
				continue;
			}

			for (const message of normaliseFieldErrors(value)) {
				const key = `${fieldName}:${message}`;

				if (seen.has(key)) {
					continue;
				}

				seen.add(key);
				errors.push({ fieldName: null, id: null, message });
			}
		}
	}

	return errors;
}

/**
 * Find the first visible screen, in screen order, with a field error.
 *
 * @returns {object|null}
 *     The screen ID and field name of the first error, or null when no
 *     visible screen has one.
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
 * Move focus to the shared error-summary box once its current content
 * (the current screen's own errors, or flow-level errors) has rendered.
 */
async function focusErrorSummaryBox() {
	await nextTick();

	errorSummaryElement.value?.focus?.();
}

/**
 * Move focus to a field once it has registered, since a screen renders
 * before its field completes registration in a later update.
 *
 * @param  {string}  fieldName
 *     The field name to focus.
 */
async function focusRegisteredField(fieldName) {
	if (!formFields[fieldName]) {
		await until(() => formFields[fieldName]).toBeTruthy({
			timeout: 1000,
			throwOnTimeout: false,
		});
	}

	focusField(fieldName);
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
 * After final validation, navigate to the first visible screen with an
 * error, or show any unowned error as a flow-level error.
 */
async function handleFinalErrorRecovery() {
	const firstErrorScreen = getFirstErrorScreen();

	if (firstErrorScreen) {
		flowErrorSummary.value = [];
		activeScreenId.value = firstErrorScreen.screenId;
		await focusRegisteredField(firstErrorScreen.fieldName);

		return;
	}

	const flowErrors = getFlowErrors();

	if (flowErrors.length > 0) {
		await showFlowErrors(flowErrors);
	}
}

/**
 * Move to the previous screen, skipping validation on the current screen.
 */
function handleBack() {
	if (!canGoBack.value) {
		return;
	}

	activeScreenId.value = screenIds.value[activeScreenIndex.value - 1];
	flowErrorSummary.value = [];
}

/**
 * Validate the visible screen before moving forward or submitting the flow.
 */
async function handleContinue() {
	if (!haveCurrentScreen.value || isSubmitting.value) {
		return;
	}

	flowErrorSummary.value = [];

	// The last screen submits the whole form; route any resulting error to
	// its owning screen or the flow-level summary.
	if (isLastScreen.value) {
		await handleFormSubmit({
			focus: false,
			scoped: false,
		});

		await handleFinalErrorRecovery();

		return;
	}

	// Validate the current screen's fields plus any root-level rule. Only the
	// active screen's fields are mounted, and form-field unregisters them on
	// unmount, so formFields and validate() see no inactive-screen fields.
	await validate({ focus: false });

	const flowErrors = getFlowErrors();

	if (isNonEmptyArray(flowErrors)) {
		await showFlowErrors(flowErrors);

		return;
	}

	if (haveCurrentScreenErrors.value) {
		await focusErrorSummaryBox();

		return;
	}

	activeScreenId.value = screenIds.value[activeScreenIndex.value + 1];

	resetSubmitButton();
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
	registerScreen,
	unregisterScreen,
});

provide("form", {
	fieldErrorsFor,
	registerField: registerFlowField,
	unregisterField,
	updateFieldValue,
	isReadonly,
	isFieldRequired,
	isCompact: computed(() => props.compact),
});

defineExpose({ isSubmitting, isDirty, resetSubmitButton });
</script>
