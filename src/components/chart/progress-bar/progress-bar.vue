<template>
	<div
		v-bind="{
			'aria-label': showLabel ? null : label,
			'aria-valuenow': internalValue,
			'aria-valuemin': min,
			'aria-valuemax': max,
			'aria-valuetext': `${percentageValue}%`,
			'aria-labelledby': showLabel ? internalId : null,
		}"
		role="progressbar"
		data-test="progress-bar"
	>
		<conditional-wrapper v-bind="{ wrap: showLabel || showValue, tag: 'div' }" class="mb-1 flex gap-2">
			<div v-if="showLabel" v-bind="{ id: internalId }" data-test="progress-bar-label">
				<slot>
					{{ label }}
				</slot>
			</div>

			<div v-if="showValue" class="ms-auto" data-test="progress-bar-value">
				<slot name="value" v-bind="{ value: internalValue }">
					{{ percentageValue }}%
				</slot>
			</div>
		</conditional-wrapper>

		<div :class="trackClasses">
			<div
				class="transition-all ease-out"
				:class="barClasses"
				:style="{ width: `${percentageValue}%` }"
			/>
		</div>
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed } from "vue";
import { nanoid } from "nanoid";

const props = defineProps({
	/**
	 * The current value represented by the progress bar.
	 */
	value: {
		type: Number,
		default: 0,
	},

	/**
	 * The minimum value of the progress bar, used to determine how much of the
	 * bar is filled based on the current value.
	 */
	min: {
		type: Number,
		default: 0,
	},

	/**
	 * The maximum value of the progress bar, used to determine how much of the
	 * bar is filled based on the current value.
	 */
	max: {
		type: Number,
		default: 100,
	},

	/**
	 * The label for the progress bar. This label is hidden by default, but is
	 * included for accessibility purposes.
	 */
	label: {
		type: String,
		default: "Loading…",
	},

	/**
	 * Whether to show the label to the user.
	 */
	showLabel: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to show the value to the user, formatted as a percentage.
	 */
	showValue: {
		type: Boolean,
		default: false,
	},

	/**
	 * Classes to apply to the track, which is the background behind the bar.
	 */
	trackClasses: {
		type: [String, Array, Object],
		default: "h-4 rounded-full bg-grey-200 dark:bg-white/20",
	},

	/**
	 * Classes to apply to the bar, which indicates the current value.
	 */
	barClasses: {
		type: String,
		default: "h-full rounded-full bg-purple-500",
	},
});

// The internal current value, allowing us to bind the current value to the
// provided minimum and maximum.
const internalValue = computed(() => clamp(props.value, props.min, props.max));
// The internal ID of this progress bar, used to link the bar to its label.
const internalId = computed(() => `progress-bar-${nanoid()}`);

// The relative width of the bar, representing the current value.
const proportionalValue = computed(() => {
	if (props.max <= 0) {
		return 0;
	}

	return (internalValue.value - props.min) / props.max;
});

// The percentage bar width - as a number between 0 and 100.
const percentageValue = computed(() => proportionalValue.value * 100);
</script>
