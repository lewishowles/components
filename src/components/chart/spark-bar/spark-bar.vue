<template>
	<div
		v-bind="{
			'aria-valuenow': internalValue,
			'aria-valuemin': min,
			'aria-valuemax': max,
		}"
		class="flex items-center gap-4"
		role="meter"
		data-test="spark-bar"
	>
		<div :class="['grow', trackClasses]">
			<div
				class="transition-all ease-out"
				:class="barClasses"
				:style="{ width: `${percentageValue}%` }"
			/>
		</div>

		<div :class="valueClasses" data-test="spark-bar-value">
			<slot v-bind="{ current: internalValue, min, max, percentage: percentageValue }">
				{{ percentageValue }}%
			</slot>
		</div>
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed } from "vue";

const props = defineProps({
	/**
	 * The current value represented by the spark bar.
	 */
	current: {
		type: Number,
		default: 0,
	},

	/**
	 * The minimum value of the spark bar, used to determine how much of the
	 * bar is filled based on the current value.
	 */
	min: {
		type: Number,
		default: 0,
	},

	/**
	 * The maximum value of the spark bar, used to determine how much of the
	 * bar is filled based on the current value.
	 */
	max: {
		type: Number,
		default: 100,
	},

	/**
	 * Classes to apply to the track, which is the background behind the bar.
	 */
	trackClasses: {
		type: [String, Array, Object],
		default: "h-1 rounded-full bg-grey-200 dark:bg-white/20",
	},

	/**
	 * Classes to apply to the bar, which indicates the current value.
	 */
	barClasses: {
		type: [String, Array, Object],
		default: "h-full rounded-full bg-purple-800 dark:bg-purple-300",
	},

	/**
	 * Classes to apply to the value display.
	 */
	valueClasses: {
		type: [String, Array, Object],
		default: "text-sm",
	},
});

// The internal current value, clamped between min and max.
const internalValue = computed(() => clamp(props.current, props.min, props.max));

// The percentage bar width - as a whole number between 0 and 100.
const percentageValue = computed(() => {
	if (props.max <= props.min) {
		return 0;
	}

	return Math.round(((internalValue.value - props.min) / (props.max - props.min)) * 100);
});
</script>
