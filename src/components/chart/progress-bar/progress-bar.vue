<template>
	<div
		v-bind="{
			role: variantRole,
			'aria-valuenow': isIndeterminate ? null : internalValue,
			'aria-valuemin': isIndeterminate ? null : min,
			'aria-valuemax': isIndeterminate ? null : max,
			'aria-valuetext': isIndeterminate ? null : valueText,
			'aria-labelledby': internalId,
		}"
		data-test="progress-bar"
	>
		<conditional-wrapper
			v-bind="{ wrap: showLabel || showValue, tag: 'div' }"
			class="mb-1 flex gap-2"
		>
			<div
				:class="{ 'sr-only': !showLabel }"
				v-bind="{ id: internalId }"
				data-test="progress-bar-label"
			>
				<slot />
			</div>

			<div v-if="showValue" class="ms-auto" data-test="progress-bar-value">
				<slot name="value" v-bind="{ current: internalValue, percentage: percentageValue }">
					{{ percentageValue }}%
				</slot>
			</div>
		</conditional-wrapper>

		<div :class="[trackClasses, { 'relative overflow-hidden': isIndeterminate }]">
			<div
				v-if="isIndeterminate"
				class="animate-progress-indeterminate absolute inset-y-0 w-1/4 rounded-full motion-reduce:w-full motion-reduce:animate-pulse"
				:class="barClasses"
				data-test="progress-bar-indeterminate"
			/>

			<div
				v-else
				class="transition-all ease-out"
				:class="barClasses"
				:style="{ width: `${percentageValue}%` }"
				data-test="progress-bar-fill"
			/>
		</div>
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed, useId } from "vue";
import { isFunction } from "@lewishowles/helpers/general";

// The valid variant values and their corresponding ARIA roles.
const progressVariants = { METER: "meter", PROGRESS: "progress" };

const props = defineProps({
	/**
	 * The current value represented by the progress bar. Pass `null` to render
	 * an indeterminate bar.
	 */
	current: {
		default: 0,
		validator: (value) => value === null || typeof value === "number",
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
	 * The kind of progress bar. Use `"progress"` for tasks with a known
	 * endpoint (e.g. file upload or a multi-step wizard). Use `"meter"` for
	 * measurements within a fixed range (e.g. disk usage or battery level).
	 */
	variant: {
		type: String,
		default: progressVariants.PROGRESS,
		validator: (value) => Object.values(progressVariants).includes(value),
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
	 * A function that receives the current value and returns a custom string
	 * for `aria-valuetext`. Use this in situations where providing a
	 * human-friendly description instead of the default percentage makes more
	 * sense, for example, `"3 of 10 files uploaded"`. Only called when the bar
	 * is not indeterminate.
	 */
	getValueLabel: {
		type: Function,
		default: null,
	},

	/**
	 * Classes to apply to the track, which is the background behind the bar.
	 */
	trackClasses: {
		type: [String, Array, Object],
		default: "p-1 rounded-full bg-grey-200 dark:bg-white/20",
	},

	/**
	 * Classes to apply to the bar, which indicates the current value.
	 */
	barClasses: {
		type: [String, Array, Object],
		default: "h-full rounded-full bg-purple-800 dark:bg-purple-300",
	},
});

// Whether the bar represents an unknown quantity rather than a specific value.
const isIndeterminate = computed(() => props.current === null);

// The internal current value, clamped between min and max.
const internalValue = computed(() => {
	if (isIndeterminate.value) {
		return null;
	}

	return clamp(props.current, props.min, props.max);
});

// The internal ID of this progress bar, used to link the bar to its label.
const uid = useId();
const internalId = computed(() => `progress-bar-${uid}`);

// The percentage bar width; a whole number between 0 and 100.
const percentageValue = computed(() => {
	if (isIndeterminate.value || props.max <= props.min) {
		return 0;
	}

	return Math.round(((internalValue.value - props.min) / (props.max - props.min)) * 100);
});

// The ARIA role, based on the variant.
const variantRole = computed(() => {
	if (props.variant === progressVariants.METER) {
		return "meter";
	}

	return "progressbar";
});

// The text announced by screen readers for the current value. Uses the
// getValueLabel function when provided, otherwise defaults to a percentage.
const valueText = computed(() => {
	if (isFunction(props.getValueLabel)) {
		return props.getValueLabel(internalValue.value);
	}

	return `${percentageValue.value}%`;
});
</script>

<style>
@media (prefers-reduced-motion: no-preference) {
	.animate-progress-indeterminate {
		animation-name: progress-bar-indeterminate;
		animation-duration: 6s;
		animation-iteration-count: infinite;
	}
}

@keyframes progress-bar-indeterminate {
	0% {
		inset-inline-start: 0;
	}
	50% {
		inset-inline-start: 75%;
	}
	100% {
		inset-inline-start: 0;
	}
}
</style>
