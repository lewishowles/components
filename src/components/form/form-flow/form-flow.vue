<template>
	<form
		novalidate
		data-component="form-flow"
		data-test="form-flow"
		:aria-busy="isSubmitting"
		@submit.prevent="handleContinue"
	>
		<div
			v-show="haveErrorSummary"
			ref="error-summary"
			tabindex="0"
			class="border-danger-subtle bg-danger-subtle text-danger mb-4 w-full rounded-sm border px-5 py-3"
			data-test="form-flow-error-summary"
		>
			<h2 class="mb-2 font-bold">
				<slot name="error-summary-title">There is a problem</slot>
			</h2>

			<ul class="list-disc ps-4">
				<li v-for="(error, index) in errorSummary" :key="`${error.id}-${index}`">
					<a
						:href="`#${error.id}`"
						class="text-current"
						data-test="form-flow-error-summary-message"
						@click.prevent="focusField(error.fieldName)"
					>
						{{ error.message }}
					</a>
				</li>
			</ul>
		</div>

		<slot v-bind="{ isSubmitting, hasErrors: haveErrorSummary }" />

		<alert-message v-if="haveEmptyFlow" type="info" class="mb-4" data-test="form-flow-empty">
			<slot name="empty">No screens are available.</slot>
		</alert-message>

		<alert-message
			v-if="haveGeneralSubmitErrors"
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
	onMounted,
	provide,
	ref,
	toRefs,
	toValue,
	useSlots,
	useTemplateRef,
	watch,
} from "vue";

import { isNonEmptyString } from "@lewishowles/helpers/string";
import { toCamelCase } from "@lewishowles/helpers/string";
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
	validate,
} = useForm({
	...toRefs(props),
	initialData: formInitialData,
	onSubmit: callSubmitListeners,
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
});

// Keep screen IDs in slot order so navigation can choose the next visible
// screen.
const screenIds = ref([]);
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
 * Move to the previous screen, skipping validation on the current screen.
 */
function handleBack() {
	if (!canGoBack.value) {
		return;
	}

	activeScreenId.value = screenIds.value[activeScreenIndex.value - 1];
}

/**
 * Validate the visible screen before moving forward or submitting the flow.
 */
async function handleContinue() {
	if (!haveCurrentScreen.value || isSubmitting.value) {
		return;
	}

	// If this is the last screen, submit handles validation.
	if (isLastScreen.value) {
		await handleFormSubmit();

		return;
	}

	// Otherwise, we validate ourselves.
	const valid = await validate();

	if (valid) {
		activeScreenId.value = screenIds.value[activeScreenIndex.value + 1];

		resetSubmitButton();
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
	registerScreen,
	unregisterScreen,
});

provide("form", {
	fieldErrorsFor,
	registerField,
	unregisterField,
	updateFieldValue,
	isReadonly,
	isFieldRequired,
	isCompact: computed(() => props.compact),
});

defineExpose({ isSubmitting, isDirty, resetSubmitButton });
</script>
