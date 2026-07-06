<template>
	<field-wrapper
		v-bind="{
			tag: 'fieldset',
			haveError,
			'aria-invalid': haveError ? 'true' : undefined,
			'data-invalid': haveError || null,
		}"
		data-component="form-date"
		data-test="form-date"
	>
		<div class="flex flex-col">
			<form-label v-bind="{ tag: 'legend', required }">
				<slot />

				<template #optional-indicator>
					<slot name="optional-indicator" />
				</template>
			</form-label>

			<conditional-wrapper v-bind="{ wrap: haveIntroduction, tag: 'p' }">
				<slot name="introduction" />
			</conditional-wrapper>
		</div>

		<div class="mt-2 mb-1 flex gap-8">
			<form-input
				ref="dayInput"
				v-model="date.day"
				v-bind="{
					required,
					id: `${inputId}-day`,
					showOptionalIndicator: false,
				}"
				class="w-20"
				data-test="form-date-day"
			>
				<slot name="day-label">Day</slot>
			</form-input>

			<form-input
				v-model="date.month"
				v-bind="{
					required,
					id: `${inputId}-month`,
					showOptionalIndicator: false,
				}"
				class="w-20"
				data-test="form-date-month"
			>
				<slot name="month-label">Month</slot>
			</form-input>

			<form-input
				v-model="date.year"
				v-bind="{
					required,
					id: `${inputId}-year`,
					showOptionalIndicator: false,
				}"
				class="w-40"
				data-test="form-date-year"
			>
				<slot name="year-label">Year</slot>
			</form-input>
		</div>

		<template v-if="haveDateHelpers">
			<div class="mb-1 flex flex-wrap gap-2 text-xs">
				<ui-button
					v-for="(dateHelperItem, dateHelperIndex) in dateHelperItems"
					:key="dateHelperIndex"
					class="button--muted"
					:aria-label="dateHelperItem.accessibleLabel"
					data-part="date-helper"
					@click="applyDateHelper(dateHelperItem)"
				>
					{{ dateHelperItem.label }}
				</ui-button>
			</div>

			<span role="status" aria-live="polite" class="sr-only" data-test="form-date-helper-status">
				<slot name="date-helper-status" v-bind="{ date: announcedDate }">
					<template v-if="announcedDate">Date set to {{ announcedDate }}.</template>
				</slot>
			</span>
		</template>

		<form-supplementary v-bind="{ inputId }">
			<template #error>
				<slot name="error" />
			</template>
			<template #help>
				<slot name="help" />
			</template>
		</form-supplementary>
	</field-wrapper>
</template>

<script setup>
import { Temporal } from "temporal-polyfill";
import { callComponentMethod } from "@lewishowles/helpers/vue";
import { computed, ref, useTemplateRef, watch } from "vue";
import { formatDate, getDateParts, toDateFromParts } from "@lewishowles/helpers/date";
import { getPathValue, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber, isNumeric } from "@lewishowles/helpers/number";
import useFormField from "@/components/form/composables/use-form-field/use-form-field";

const props = defineProps({
	/**
	 * Any ID to apply to this field. If an ID is not provided, one will be
	 * generated at random. Note that when providing an ID, please make sure
	 * that it is unique.
	 */
	id: {
		type: String,
		default: null,
	},

	/**
	 * Whether this field is required.
	 */
	required: {
		type: Boolean,
		default: false,
	},

	/**
	 * Optional quick-select date helpers, rendered as buttons beneath the
	 * date inputs. Each helper is `{ label, unit, value }`, where `unit` is
	 * one of "day", "week", "month", or "year", and `value` is an integer
	 * amount of that unit to add relative to today (negative for the past,
	 * `0` for today).
	 */
	dateHelpers: {
		type: Array,
		default: () => [],
	},
});

const { inputId, haveIntroduction, haveError } = useFormField({ id: props.id });

// The external model, used for initialisation and updated when our internal
// model changes.
const model = defineModel({
	type: [Object, String],
});

// Our internal representation of the date, which the inputs bind to.
const date = ref({ day: "", month: "", year: "" });
// A reference to the day input, which we will use to focus this field.
const dayInput = useTemplateRef("dayInput");
// The display date last applied via a date helper, announced to assistive
// technology via the status live region.
const announcedDate = ref(null);

// The Temporal duration key for each supported date-helper unit.
const dateHelperUnitDurationKeys = {
	day: "days",
	week: "weeks",
	month: "months",
	year: "years",
};

// Resolved, displayable versions of the configured date helpers. Invalid
// entries (missing label, unsupported unit, non-integer value) are dropped
// rather than rendered broken.
const dateHelperItems = computed(() => {
	if (!isNonEmptyArray(props.dateHelpers)) {
		return [];
	}

	return props.dateHelpers.map(resolveDateHelperItem).filter((item) => item !== null);
});

// Whether we have at least one valid, resolved date helper to render.
const haveDateHelpers = computed(() => dateHelperItems.value.length > 0);

// Whether we have a valid date. We use this to hide inputs and avoid errors if
// the provided model date is invalid. By "valid", we don't mean a valid date,
// just a valid model that could be a date.
const haveValidDate = computed(() => {
	if (!isNonEmptyObject(date.value)) {
		return false;
	}

	return ["day", "month", "year"].every((part) => {
		const partValue = date.value[part];
		const isStringPart = isNonEmptyString(partValue);
		const isNumberPart = isNumber(partValue);
		const isPositivePart = partValue > 0;

		return isStringPart || (isNumberPart && isPositivePart);
	});
});

initialise();

// Reflect changes to our internal date back to the model. Declared after
// initialise() so the initial seeding doesn't emit a value.
watch(
	date,
	() => {
		model.value = { ...date.value };
	},
	{ deep: true },
);

/**
 * Initialise our date, either by setting a default value for our model, or
 * copying the provided values to our internal date object.
 */
function initialise() {
	// An ISO string is parsed directly into our internal date parts.
	if (isNonEmptyString(model.value)) {
		setDateFromIsoString(model.value);

		return;
	}

	// Anything that isn't a usable object leaves the internal date at its empty
	// default.
	if (!isNonEmptyObject(model.value)) {
		return;
	}

	// Seed our internal date from the provided model, then normalise each part.
	date.value = { ...model.value };

	date.value.day = initialiseDatePart("day");
	date.value.month = initialiseDatePart("month");
	date.value.year = initialiseDatePart("year");
}

/**
 * Initialise a single date part from our date, checking if there is an initial
 * value provided by the user.
 *
 * @param  {string}  part
 *	 The name of the part being initialised, e.g. "day".
 */
function initialiseDatePart(part) {
	const partValue = getPathValue(date.value, part);
	const isNumericString = isNonEmptyString(partValue) && isNumeric(partValue);
	const isPositiveNumber = isNumber(partValue) && partValue > 0;

	if (!isNumericString && !isPositiveNumber) {
		return "";
	}

	return partValue.toString();
}

/**
 * Get a string representation of the current date.
 */
function toString() {
	if (!haveValidDate.value) {
		return "";
	}

	const plainDate = toDateFromParts(date.value);

	if (plainDate === null) {
		return "";
	}

	return plainDate.toString();
}

/**
 * Set the current date from a string. If an invalid date is encountered, no new
 * value will be set.
 *
 * @param  {string}  dateString
 *     The date to set, represented as a string.
 */
function setDateFromIsoString(dateString) {
	if (!isNonEmptyString(dateString)) {
		return;
	}

	const parts = getDateParts(dateString);

	if (parts === null) {
		console.error("form-date[setDateFromString]", `Unable to parse date: ${dateString}`);

		return;
	}

	date.value = {
		day: parts.day.toString(),
		month: parts.month.toString(),
		year: parts.year.toString(),
	};
}

/**
 * Trigger focus on the "day" input.
 */
function triggerFocus() {
	callComponentMethod(dayInput.value, "triggerFocus");
}

/**
 * Resolve a single configured date helper into a displayable item, or `null`
 * if the entry is invalid.
 *
 * @param  {object}  helper
 *     The configured date helper, `{ label, unit, value }`.
 */
function resolveDateHelperItem(helper) {
	if (!isNonEmptyObject(helper) || !isNonEmptyString(helper.label)) {
		return null;
	}

	const durationKey = dateHelperUnitDurationKeys[helper.unit];

	if (durationKey === undefined || !Number.isInteger(helper.value)) {
		return null;
	}

	const resolvedDate = Temporal.Now.plainDateISO().add({ [durationKey]: helper.value });
	const displayDate = formatDate(resolvedDate, "date");

	return {
		label: helper.label,
		resolvedDate,
		displayDate,
		accessibleLabel: isNonEmptyString(displayDate)
			? `${helper.label}, ${displayDate}`
			: helper.label,
	};
}

/**
 * Apply a resolved date helper, setting the current date and announcing the
 * change to assistive technology. Focus deliberately stays on the activated
 * button rather than moving to the date inputs.
 *
 * @param  {object}  dateHelperItem
 *     The resolved date helper item to apply.
 */
function applyDateHelper(dateHelperItem) {
	const { resolvedDate } = dateHelperItem;

	date.value = {
		day: resolvedDate.day.toString(),
		month: resolvedDate.month.toString(),
		year: resolvedDate.year.toString(),
	};

	announcedDate.value = dateHelperItem.displayDate;
}

// The ID of the first focusable input, used by form-field to register the
// correct anchor target for error summary links.
const focusId = computed(() => `${inputId.value}-day`);

defineExpose({
	focusId,
	toString,
	setDateFromIsoString,
	triggerFocus,
});
</script>
