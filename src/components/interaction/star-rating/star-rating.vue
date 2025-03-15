<template>
	<form-radio-group v-bind="{ options: ratingOptions }" data-test="star-rating" @mouseleave="highlightedStar = null">
		<slot />

		<template #options="{ options, name }">
			<div ref="optionsWrapperElement" class="mt-1 flex items-center gap-1">
				<div v-for="option in options" :key="option.id">
					<input ref="inputReferences" v-model="model" type="radio" class="peer sr-only" v-bind="{ id: option.id, value: option.value, name }" />

					<form-label v-bind="{ id: option.id, styled: false }" class="block cursor-pointer rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-purple-800 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-purple-400 dark:peer-focus-visible:ring-offset-0" @mouseover="highlightedStar = option.value">
						<base-icon
							viewBox="0 0 16 16"
							class="size-6 transition-colors"
							:class="{
								'text-yellow-600': highlightedStar >= option.value && (option.value > model || !model),
								'fill-yellow-600 text-yellow-600 hover:fill-yellow-800 hover:text-yellow-800': option.value <= model,
								'fill-transparent text-grey-300 hover:text-yellow-600': option.value > model || !model
							}"
						>
							<title>{{ option.value }}</title>
							<path stroke="currentColor" d="M8 .5a.3.3 0 0 1 .157.038.16.16 0 0 1 .067.067l2.182 4.423 4.88.709a.25.25 0 0 1 .125.056c.086.204.08.303.012.369l-3.531 3.441.834 4.862a.25.25 0 0 1-.099.243.25.25 0 0 1-.263.02l-4.365-2.296-4.364 2.295a.25.25 0 0 1-.348-.126.25.25 0 0 1-.015-.137l.834-4.86L.574 6.16a.25.25 0 0 1-.062-.256.25.25 0 0 1 .2-.17l4.881-.708L7.776.605a.16.16 0 0 1 .066-.067A.3.3 0 0 1 7.999.5Z" />
						</base-icon>
					</form-label>
				</div>

				<div v-if="haveCurrentRating" class="text-sm ms-1" data-test="star-rating-current-rating">
					<slot name="current-rating" />
				</div>
			</div>
		</template>

		<template #introduction>
			<slot name="introduction" />
		</template>
		<template #error>
			<slot name="error" />
		</template>
		<template #help>
			<slot name="help" />
		</template>
	</form-radio-group>
</template>

<script setup>
/**
 * Create a group of radio buttons styled as buttons, based on provided options.
 *
 * `button-group` allows options to be provided in a few different formats for
 * simplicity.
 */
import { computed, ref, useSlots } from "vue";
import { head, isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";

import FormLabel from "@/components/form/form-label/form-label.vue";

const model = defineModel({
	type: [String, Number],
});

const slots = useSlots();
// The currently highlighted star, allowing us to be smarter with our
// highlighting.
const highlightedStar = ref(null);
const ratingOptions = ref([1, 2, 3, 4, 5]);
// A reference to the inputs, allowing us to trigger focus.
const inputReferences = ref([]);
// The element wrapping our options template, which allows us to determine which
// radio button is checked and focus the appropriate label.
const optionsWrapperElement = ref(null);
// Whether the user has provided any "current rating" text.
const haveCurrentRating = computed(() => isNonEmptySlot(slots["current-rating"]));

/**
 * Trigger focus on the selected radio button, or the first if no selection has
 * been made. Because we're using `form-radio` for the heavy lifting, but
 * overriding the template, we don't simply have access to the options, so we're
 * determining the selection via the HTML instead of passing those options
 * around.
 */
function triggerFocus() {
	if (!isNonEmptyArray(inputReferences.value)) {
		return;
	}

	const selectedOption = optionsWrapperElement.value.querySelector(":checked");

	if (selectedOption) {
		runComponentMethod(selectedOption, "focus");

		return;
	}

	focusFirstInput();
}

/**
 * Focus the first input of the group.
 */
function focusFirstInput() {
	const input = head(inputReferences.value);

	runComponentMethod(input, "focus");
}

defineExpose({
	triggerFocus,
});
</script>
