<template>
	<div class="flex gap-8" data-test="form-date">
		<form-input v-if="haveValidDate" v-model="date.day" v-bind="{ required }" class="w-20" data-test="form-date-day">
			<slot name="day-label">
				Day
			</slot>
		</form-input>

		<form-input v-if="haveValidDate" v-model="date.month" v-bind="{ required }" class="w-20" data-test="form-date-month">
			<slot name="month-label">
				Month
			</slot>
		</form-input>

		<form-input v-if="haveValidDate" v-model="date.year" v-bind="{ required }" class="w-40" data-test="form-date-year">
			<slot name="year-label">
				Year
			</slot>
		</form-input>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber, isNumeric } from "@lewishowles/helpers/number";

defineProps({
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
	type: Object,
});

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
</script>
