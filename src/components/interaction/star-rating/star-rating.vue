<template>
	<form-radio-group
		v-bind="{ options: ratingOptions }"
		data-component="star-rating"
		:data-readonly="readOnly || null"
		data-test="star-rating"
		@mouseleave="highlightedValue = null"
	>
		<slot />

		<template #options="{ options, name }">
			<span v-if="readOnly" :id="readOnlyLabelId" class="sr-only">
				<slot name="read-only-label" v-bind="{ value: model }">{{ readOnlyLabel }}</slot>
			</span>

			<div
				ref="optionsWrapperElement"
				class="mt-1 flex items-center gap-1"
				v-bind="{
					role: readOnly ? 'img' : undefined,
					'aria-labelledby': readOnly ? readOnlyLabelId : undefined,
				}"
				data-part="options"
			>
				<template v-if="!readOnly">
					<div v-for="option in options" :key="option.id" data-part="option">
						<input
							ref="inputReferences"
							v-model="model"
							type="radio"
							class="peer sr-only"
							v-bind="{ id: option.id, value: option.value, name }"
							@focus="highlightedValue = option.value"
							@blur="handleStarBlur"
						/>

						<form-label
							v-bind="{ id: option.id, styled: false }"
							class="block cursor-pointer rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-purple-800 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-purple-400 dark:peer-focus-visible:ring-offset-0"
							@mouseover="highlightedValue = option.value"
						>
							<span class="sr-only">
								<slot name="option-label" v-bind="{ value: option.value }">{{
									iconLabel(option.value)
								}}</slot>
							</span>

							<base-icon
								v-if="isStar"
								viewBox="0 0 16 16"
								class="size-6 transition-colors"
								:class="{
									'fill-transparent text-yellow-600': ratingIsHighlighted(option.value),
									'fill-yellow-600 text-yellow-600 hover:fill-yellow-800 hover:text-yellow-800':
										ratingIsSelected(option.value),
									'text-grey-300 fill-transparent hover:text-yellow-600 dark:text-white/30':
										ratingIsInert(option.value),
								}"
							>
								<title>{{ iconLabel(option.value) }}</title>
								<path
									stroke="currentColor"
									d="M8 .5a.3.3 0 0 1 .157.038.16.16 0 0 1 .067.067l2.182 4.423 4.88.709a.25.25 0 0 1 .125.056c.086.204.08.303.012.369l-3.531 3.441.834 4.862a.25.25 0 0 1-.099.243.25.25 0 0 1-.263.02l-4.365-2.296-4.364 2.295a.25.25 0 0 1-.348-.126.25.25 0 0 1-.015-.137l.834-4.86L.574 6.16a.25.25 0 0 1-.062-.256.25.25 0 0 1 .2-.17l4.881-.708L7.776.605a.16.16 0 0 1 .066-.067A.3.3 0 0 1 7.999.5Z"
								/>
							</base-icon>

							<base-icon
								v-if="isHeart"
								viewBox="0 0 16 16"
								class="size-6 transition-colors"
								:class="{
									'fill-transparent text-red-600': ratingIsHighlighted(option.value),
									'fill-red-600 text-red-600 hover:fill-red-800 hover:text-red-800':
										ratingIsSelected(option.value),
									'text-grey-300 fill-transparent hover:text-red-600': ratingIsInert(option.value),
								}"
							>
								<title>{{ iconLabel(option.value) }}</title>
								<path
									stroke="currentColor"
									d="M10.911.5a4.1 4.1 0 0 1 2.897 1.215A4.08 4.08 0 0 1 15 4.612c0 1.867-.718 3.453-1.687 4.748-1.64 2.195-4 3.574-4.977 4.084a1.27 1.27 0 0 1-1.173 0c-.978-.51-3.336-1.89-4.976-4.085C1.218 8.063.5 6.477.5 4.607a4.07 4.07 0 0 1 1.189-2.892A4.09 4.09 0 0 1 4.566.5 4.14 4.14 0 0 1 7.75 2.048 4.12 4.12 0 0 1 10.911.5Z"
								/>
							</base-icon>
						</form-label>
					</div>
				</template>

				<base-icon v-else-if="isHeart" viewBox="0 0 16 16" class="size-6 fill-red-600 text-red-600">
					<path
						stroke="currentColor"
						d="M10.911.5a4.1 4.1 0 0 1 2.897 1.215A4.08 4.08 0 0 1 15 4.612c0 1.867-.718 3.453-1.687 4.748-1.64 2.195-4 3.574-4.977 4.084a1.27 1.27 0 0 1-1.173 0c-.978-.51-3.336-1.89-4.976-4.085C1.218 8.063.5 6.477.5 4.607a4.07 4.07 0 0 1 1.189-2.892A4.09 4.09 0 0 1 4.566.5 4.14 4.14 0 0 1 7.75 2.048 4.12 4.12 0 0 1 10.911.5Z"
					/>
				</base-icon>

				<base-icon v-else viewBox="0 0 16 16" class="size-6 fill-yellow-600 text-yellow-600">
					<path
						stroke="currentColor"
						d="M8 .5a.3.3 0 0 1 .157.038.16.16 0 0 1 .067.067l2.182 4.423 4.88.709a.25.25 0 0 1 .125.056c.086.204.08.303.012.369l-3.531 3.441.834 4.862a.25.25 0 0 1-.099.243.25.25 0 0 1-.263.02l-4.365-2.296-4.364 2.295a.25.25 0 0 1-.348-.126.25.25 0 0 1-.015-.137l.834-4.86L.574 6.16a.25.25 0 0 1-.062-.256.25.25 0 0 1 .2-.17l4.881-.708L7.776.605a.16.16 0 0 1 .066-.067A.3.3 0 0 1 7.999.5Z"
					/>
				</base-icon>

				<div v-if="haveCurrentRating" class="ms-1 text-sm" data-test="star-rating-current-rating">
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
import { computed, ref, useId, useSlots } from "vue";
import { head, isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";

import FormLabel from "@/components/form/form-label/form-label.vue";

const props = defineProps({
	/**
	 * Whether to allow the user to choose a rating. If false, this component
	 * can just be used to display a current rating, or activated based on some
	 * other change, such as an edit.
	 */
	readOnly: {
		type: Boolean,
		default: false,
	},

	/**
	 * One of `star` or `heart`. Defaults to `star` if the shape is
	 * unrecognised.
	 */
	shape: {
		type: String,
		default: "star",
	},

	/**
	 * The maximum rating value and number of icons to display.
	 */
	max: {
		type: Number,
		default: 5,
	},
});

const model = defineModel({
	type: [String, Number],
});

const slots = useSlots();
// Stable ID linking the readOnly label element to the display wrapper via aria-labelledby.
const readOnlyLabelId = useId();
// The currently highlighted star, allowing us to be smarter with our
// highlighting.
const highlightedValue = ref(null);
// The selectable rating options, derived from the maximum value.
const ratingOptions = computed(() => Array.from({ length: props.max }, (_, i) => i + 1));
// A reference to the inputs, allowing us to trigger focus.
const inputReferences = ref([]);
// The element wrapping our options template, which allows us to determine which
// radio button is checked and focus the appropriate label.
const optionsWrapperElement = ref(null);
// Whether the user has provided any "current rating" text.
const haveCurrentRating = computed(() => isNonEmptySlot(slots["current-rating"]));

// Determine whether our chosen shape is a heart or the default star.
const isHeart = computed(() => props.shape === "heart");
const isStar = computed(() => !isHeart.value);

// The unit name for a single icon, used to build accessible labels.
const unitSingular = computed(() => (isHeart.value ? "heart" : "star"));
const unitPlural = computed(() => `${unitSingular.value}s`);

// The accessible label for the readOnly display, describing the current value.
// "of 5 stars" always uses the plural because it refers to the scale, not the count.
const readOnlyLabel = computed(() => {
	if (!model.value) {
		return `${unitSingular.value[0].toUpperCase()}${unitSingular.value.slice(1)} rating`;
	}

	return `Rating: ${model.value} of ${props.max} ${unitPlural.value}`;
});

/**
 * Return a unit-aware accessible label for a given rating value, e.g. "1 star"
 * or "3 hearts".
 *
 * @param  {number}  value
 *     The rating value to label.
 */
function iconLabel(value) {
	const unit = value === 1 ? unitSingular.value : unitPlural.value;

	return `${value} ${unit}`;
}

/**
 * Clear the hover preview when focus moves outside the options wrapper.
 *
 * @param  {FocusEvent}  event
 *     The blur event fired by a radio input.
 */
function handleStarBlur(event) {
	if (!optionsWrapperElement.value?.contains(event.relatedTarget)) {
		highlightedValue.value = null;
	}
}

/**
 * Determine whether a particular rating value is highlighted. That is, it's the
 * currently highlighted value, or the highlighted value is greater than this
 * value, and we're not highlighting ratings that are already selected.
 *
 * @param  {number}  value
 *     The value to compare.
 */
function ratingIsHighlighted(value) {
	return highlightedValue.value >= value && (value > model.value || !model.value);
}

/**
 * Determine whether a particular rating value is selected. That is, it's the
 * currently selected value, or the selected value is greater than this value.
 *
 * @param  {number}  value
 *     The value to compare.
 */
function ratingIsSelected(value) {
	return value <= model.value;
}

/**
 * Determine whether a particular rating value is inert. That is, it is neither
 * highlighted or selected, and nothing greater than it is highlighted or
 * selected.
 *
 * @param  {number}  value
 *     The value to compare.
 */
function ratingIsInert(value) {
	return !ratingIsHighlighted(value) && !ratingIsSelected(value);
}

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
