<template>
	<div
		v-bind="{
			'aria-label': label,
			'aria-valuenow': internalCurrentStep,
			'aria-valuemin': 1,
			'aria-valuemax': stepCount,
			'aria-valuetext': `${percentageValue}%`,
			'aria-labelledby': internalId,
		}"
		role="progressbar"
		data-test="step-indicator"
	>
		<div class="font-semibold" v-bind="{ id: internalId }" data-test="step-indicator-label">
			<slot />
		</div>

		<div class="flex items-center gap-2" data-test="step-indicator-progress">
			<div class="h-1 rounded-full bg-grey-200 dark:bg-white/20 w-full max-w-16">
				<div
					class="h-full rounded-full bg-purple-800 dark:bg-purple-300 transition-all ease-out"
					:style="{ width: `${percentageValue}%` }"
				/>
			</div>

			<span class="text-sm text-grey-500 dark:text-white/60" data-test="step-indicator-progress">Step {{ currentStep }} of {{ stepCount }}</span>
		</div>
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed, useSlots } from "vue";
import { getSlotText } from "@lewishowles/helpers/vue";
import { nanoid } from "nanoid";

const props = defineProps({
	/**
	 * The user's current step.
	 */
	currentStep: {
		type: Number,
		default: 1,
	},

	/**
	 * The total number of steps in this process or flow.
	 */
	stepCount: {
		type: Number,
		required: true,
	},
});

const slots = useSlots();
// The name of the current step.
const label = computed(() => getSlotText(slots.default));
// The internal current value, allowing us to bind the current value to the
// provided minimum and maximum.
const internalCurrentStep = computed(() => clamp(props.currentStep, 1, props.stepCount));
// The internal ID of this progress bar, used to link the bar to its label.
const internalId = computed(() => `step-indicator-${nanoid()}`);

// The relative width of the bar, representing the current step.
const proportionalValue = computed(() => {
	if (props.stepCount <= 0) {
		return 0;
	}

	return internalCurrentStep.value / props.stepCount;
});

// The percentage bar width - as a number between 0 and 100.
const percentageValue = computed(() => proportionalValue.value * 100);
</script>
