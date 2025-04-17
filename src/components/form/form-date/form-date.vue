<template>
	<field-wrapper v-bind="{ tag: 'fieldset', haveError }" data-test="form-date">
		<form-label tag="legend">
			<slot />
		</form-label>

		<div class="flex gap-8">
			<form-input
				v-if="haveValidDate"
				v-model="date.day"
				v-bind="{
					required,
					id: `${inputId}-day`,
					placeholder: dayPlaceholder,
				}"
				class="w-20"
				data-test="form-date-day"
			>
				<slot name="day-label">
					Day
				</slot>
			</form-input>

			<form-input
				v-if="haveValidDate"
				v-model="date.month"
				v-bind="{
					required,
					id: `${inputId}-month`,
					placeholder: monthPlaceholder,
				}"
				class="w-20"
				data-test="form-date-month"
			>
				<slot name="month-label">
					Month
				</slot>
			</form-input>

			<form-input
				v-if="haveValidDate"
				v-model="date.year"
				v-bind="{
					required,
					id: `${inputId}-year`,
					placeholder: yearPlaceholder,
				}"
				class="w-40"
				data-test="form-date-year"
			>
				<slot name="year-label">
					Year
				</slot>
			</form-input>
		</div>

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
import { computed } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber, isNumeric } from "@lewishowles/helpers/number";
import { Temporal } from "temporal-polyfill";
import useInputId from "@/components/form/composables/use-input-id";

import FieldWrapper from "@/components/form/fragments/field-wrapper/field-wrapper.vue";
import FormLabel from "@/components/form/form-label/form-label.vue";
import FormSupplementary from "@/components/form/fragments/form-supplementary/form-supplementary.vue";

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
});

// The current value of our date.
const date = defineModel({
	type: [Object, String],
});

// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);

initialise();

// Whether we have a valid date. We use this to hide inputs and avoid errors if
// the provided model date is invalid. By "valid", we don't mean a valid date,
// just a valid model that could be a date.
const haveValidDate = computed(() => {
	if (!isNonEmptyObject(date.value)) {
		return false;
	}

	return ["day", "month", "year"].every(part => {
		const partValue = date.value[part];
		const isStringPart = typeof partValue === "string";
		const isNumberPart = isNumber(partValue);
		const isPositivePart = partValue > 0;

		return isStringPart || (isNumberPart && isPositivePart);
	});
});

/**
 * Initialise our date, either by setting a default value for our model, or
 * copying the provided values to our internal date object.
 */
function initialise() {
	if (isNonEmptyString(date.value)) {
		setDateFromIsoString(date.value);
	}

	if (!isNonEmptyObject(date.value)) {
		date.value = { day: "", month: "", year: "" };

		return;
	}

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
	const partValue = get(date.value, part);

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

	try {
		const plainDate = Temporal.PlainDate.from(date.value);

		return plainDate.toString();
	} catch (error) {
		console.error("form-date[toString]", error);

		return "";
	}
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

	try {
		const { day, month, year } = Temporal.PlainDate.from(dateString);

		date.value = { day: day.toString(), month: month.toString(), year: year.toString() };
	} catch (error) {
		console.error("form-date[setDateFromString]", error);
	}
}

window.Temporal = Temporal;

defineExpose({
	toString,
	setDateFromIsoString,
});
</script>
