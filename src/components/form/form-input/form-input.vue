<template>
	<div class="flex flex-col gap-2" data-test="form-input">
		<form-label v-bind="{ id: inputId }">
			<slot />
		</form-label>

		<conditional-wrapper v-bind="{ wrap: haveIcon || haveText }" class="relative flex">
			<div v-if="haveIconStart" class="absolute inset-y-0 start-0 flex items-center px-3">
				<component :is="iconStart" class="size-4 stroke-current text-grey-500" data-test="form-input-icon-start" />
			</div>
			<div v-else-if="haveTextStart" class="flex items-center rounded-s-md border border-r-0 border-grey-300 bg-gradient-to-b from-white to-grey-50 px-3 py-2" data-test="form-input-text-start">
				<slot name="text-start" />
			</div>

			<input
				v-model="model"
				class="text-gray-900 block w-full rounded-md px-3 py-2 shadow-sm outline-none ring-1 ring-inset ring-grey-300 transition-shadow placeholder:text-grey-400 focus:ring-2 focus:ring-purple-600"
				:class="{ 'pl-10': haveIconStart, 'pr-10': haveIconEnd, 'rounded-l-none': haveTextStart, 'rounded-r-none': haveTextEnd }"
				v-bind="{
					id: inputId,
					placeholder,
					'aria-describedby': describedBy,
					...inputAttributes,
				}"
			/>

			<div v-if="haveIconEnd" class="absolute inset-y-0 end-0 flex items-center px-3">
				<component :is="iconEnd" class="size-4 stroke-current text-grey-500" data-test="form-input-icon-end" />
			</div>
			<div v-else-if="haveTextEnd" class="flex items-center rounded-e-md border border-l-0 border-grey-300 bg-gradient-to-b from-white to-grey-50 px-3 py-2" data-test="form-input-text-end">
				<slot name="text-end" />
			</div>
		</conditional-wrapper>

		<form-supplementary v-bind="{ inputId }" @update:describedby="updateDescribedBy">
			<template #error>
				<slot name="error" />
			</template>
			<template #help>
				<slot name="help" />
			</template>
		</form-supplementary>
	</div>
</template>

<script setup>
/**
 * A useful wrapper to the `input` tag, providing consistent styling and helpful
 * guard rails, such as automatically linking the field and its label.
 *
 * The `default` slot contains the label for the input.
 *
 * `error` and `help` slots exist for additional descriptive text.
 */
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import useFormSupplementary from "@/components/form/composables/use-form-supplementary";
import useInputId from "@/components/form/composables/use-input-id";

import FormLabel from "@/components/form/form-label/form-label.vue";
import FormSupplementary from "@/components/form/form-supplementary/form-supplementary.vue";

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
	 * Any placeholder to show in the input. Do not use a placeholder for
	 * critical information. Always use the label and help text as priorities.
	 */
	placeholder: {
		type: String,
		default: null,
	},

	/**
	 * Any additional attributes to pass to the input itself, such as `required`
	 * or `autocomplete`.
	 */
	inputAttributes: {
		type: String,
		default: null,
	},

	/**
	 * An icon to display at the start of the input.
	 */
	iconStart: {
		type: String,
		default: null,
	},

	/**
	 * An icon to display at the end of the input.
	 */
	iconEnd: {
		type: String,
		default: null,
	},
});

const slots = useSlots();

const model = defineModel({
	type: String,
});

// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);
// Utilise form supplementary to retrieve the appropriate describedby attribute.
const { updateDescribedBy, describedBy } = useFormSupplementary(inputId.value);
// Whether a start icon is defined.
const haveIconStart = computed(() => isNonEmptyString(props.iconStart));
// Whether an end icon is defined.
const haveIconEnd = computed(() => isNonEmptyString(props.iconEnd));
// Whether any icon is defined.
const haveIcon = computed(() => haveIconStart.value || haveIconEnd.value);
// Whether start text has been provided.
const haveTextStart = computed(() => isNonEmptySlot(slots["text-start"]));
// Whether end text has been provided.
const haveTextEnd = computed(() => isNonEmptySlot(slots["text-end"]));
// Whether any text (start or end) has been provided
const haveText = computed(() => haveTextStart.value || haveTextEnd.value);
</script>
