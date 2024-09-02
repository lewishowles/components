<template>
	<fieldset class="flex flex-col gap-1" v-bind="{ 'aria-describedby': describedBy }" data-test="radio-group">
		<form-label v-bind="{ tag: 'legend' }" class="mb-2">
			<slot />
		</form-label>

		<conditional-wrapper v-bind="{ wrap: haveIntroduction, tag: 'p' }">
			<slot name="introduction" />
		</conditional-wrapper>

		<slot name="options" v-bind="{ options: internalOptions, name: name || inputId }">
			<div class="flex" :class="{ 'gap-10': inline, 'flex-col gap-2': !inline }">
				<template v-for="option in internalOptions" :key="option.id">
					<div class="flex items-center gap-2">
						<input v-model="model" type="radio" class="size-4 appearance-none rounded-full outline-none ring-1 ring-grey-300 transition-all checked:bg-current checked:text-purple-800 checked:ring-current focus:ring-2 focus:ring-purple-800 checked:focus:ring-offset-2" v-bind="{ id: option.id, value: option.value, name: name || inputId }" />

						<form-label v-bind="{ id: option.id, styled: false }" class="leading-6">
							{{ option.label }}
						</form-label>
					</div>
				</template>
			</div>
		</slot>

		<form-supplementary v-bind="{ inputId }" @update:describedby="updateDescribedBy">
			<template #error>
				<slot name="error" />
			</template>
			<template #help>
				<slot name="help" />
			</template>
		</form-supplementary>
	</fieldset>
</template>

<script setup>
/**
 * Create a group of radio buttons based on provided options.
 *
 * `radio-group` allows options to be provided in a few different formats for
 * simplicity.
 */
import { computed, useSlots } from "vue";
import { deepCopy, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";
import useFormSupplementary from "@/components/form/composables/use-form-supplementary";
import useInputId from "@/components/form/composables/use-input-id";

import FormLabel from "@/components/form/form-label/form-label.vue";
import FormSupplementary from "@/components/form/form-supplementary/form-supplementary.vue";

const props = defineProps({
	/**
	 * The radio options. Options can be:
	 *
	 * string[] - ["option1", "option2", "option3"]
	 * object   - { value: "label" }
	 * object[] - [{ label: "Label", value: "value" }]
	 */
	options: {
		type: [Array, Object],
		required: true,
	},

	/**
	 * A name for this radio group. If not set, the input ID is used.
	 */
	name: {
		type: String,
		default: null,
	},

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
	 * Whether to display options inline (horizontally). This is only
	 * recommended when there are two to three options. Any more than that, and
	 * vertical display is more clear for the user.
	 */
	inline: {
		type: Boolean,
		default: false,
	},
});

const model = defineModel({
	type: String,
});

const slots = useSlots();
// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);
// Utilise form supplementary to retrieve the appropriate describedby attribute.
const { updateDescribedBy, describedBy } = useFormSupplementary(inputId.value);
// Whether an introduction has been provided.
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));

// Our standardised options, converting the range of allowed options formats
// into an array of objects containing a label and a value.
const internalOptions = computed(() => {
	if (!isNonEmptyObject(props.options) && !isNonEmptyArray(props.options)) {
		return [];
	}

	const providedOptions = deepCopy(props.options);
	const options = [];

	if (isNonEmptyObject(providedOptions)) {
		for (const value in providedOptions) {
			if (Object.hasOwn(providedOptions, value)) {
				const label = providedOptions[value];

				options.push({ label, value });
			}
		}
	}

	if (isNonEmptyArray(providedOptions)) {
		providedOptions.forEach(option => {
			if (!isNonEmptyString(option) && !isNonEmptyObject(option)) {
				return;
			}

			if (isNonEmptyString(option)) {
				options.push({ label: option, value: option });

				return;
			}

			if (Object.hasOwn(option, "label") && Object.hasOwn(option, "value")) {
				options.push(option);
			}
		});
	}

	if (!isNonEmptyArray(options)) {
		return [];
	}

	// Before returning, we generate a random ID for each option, to allow us to
	// properly link labels and inputs, as well as indicators as to the position
	// of each option in the list.
	const lastOptionIndex = options.length - 1;

	return options.map((option, optionIndex) => {
		option.first = optionIndex === 0;
		option.last = optionIndex === lastOptionIndex;
		option.id = nanoid();

		return option;
	});
});
</script>
