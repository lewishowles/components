<template>
	<div class="flex flex-col gap-2" data-test="form-input">
		<form-label v-bind="{ id: inputId }">
			<slot />
		</form-label>

		<input
			class="text-gray-900 block w-full rounded-md border-0 px-3 py-2 shadow-sm outline-none ring-1 ring-inset ring-grey-300 placeholder:text-grey-400 focus:ring-2 focus:ring-inset focus:ring-purple-600"
			v-bind="{
				id: inputId,
				placeholder,
				'aria-describedby': describedBy,
				...inputAttributes,
			}"
		/>

		<div v-if="haveHelp || haveError" class="inline-flex flex-wrap gap-2">
			<form-error v-if="haveError" v-bind="{ id: errorId }">
				<slot name="error" />
			</form-error>

			<form-help v-if="haveHelp" v-bind="{ id: helpId }">
				<slot name="help" />
			</form-help>
		</div>
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
import { nanoid } from "nanoid";

import FormLabel from "../form-label/form-label.vue";
import FormError from "../form-error/form-error.vue";
import FormHelp from "../form-help/form-help.vue";

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
});

const slots = useSlots();

// The ID used by the input and label. If an ID is provided in props, that is
// used as-is.
const inputId = computed(() => {
	if (isNonEmptyString(props.id)) {
		return props.id;
	}

	return nanoid();
});

// Whether help text has been provided.
const haveHelp = computed(() => isNonEmptySlot(slots.help));
// Whether error text has been provided.
const haveError = computed(() => isNonEmptySlot(slots.error));

// The ID of the help element. This is used in aria-describedby to link the
// input and its help.
const helpId = computed(() => {
	if (!haveHelp.value || !isNonEmptyString(inputId.value)) {
		return null;
	}

	return `${inputId.value}-help`;
});

// The ID of the error element. This is used in aria-describedby to link the
// input and its error message.
const errorId = computed(() => {
	if (!haveError.value || !isNonEmptyString(inputId.value)) {
		return null;
	}

	return `${inputId.value}-error`;
});

// The IDs of any additional text for this input.
const describedBy = computed(() => {
	if (!haveHelp.value && !haveError.value) {
		return null;
	}

	return [helpId.value, errorId.value].filter(id => id).join(" ");
});
</script>
