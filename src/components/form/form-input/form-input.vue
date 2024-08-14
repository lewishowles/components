<template>
	<div class="flex flex-col" data-test="form-input">
		<form-label v-bind="{ id: inputId }">
			<slot />
		</form-label>

		<input class="text-gray-900 mt-2 block w-full rounded-md border-0 px-3 py-2 shadow-sm outline-none ring-1 ring-inset ring-grey-300 placeholder:text-grey-400 focus:ring-2 focus:ring-inset focus:ring-purple-600" v-bind="{ id: inputId, placeholder }" />
	</div>
</template>

<script setup>
/**
 * A useful wrapper to the `input` tag, providing consistent styling and helpful
 * guard rails, such as automatically linking the field and its label.
 *
 * This component will also show a warning if no label is provided, which is
 * crucial for accessibility.
 */
import { computed } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";

import FormLabel from "../form-label/form-label.vue";

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
});

// The ID used by the input and label. If an ID is provided in props, that is
// used as-is.
const inputId = computed(() => {
	if (isNonEmptyString(props.id)) {
		return props.id;
	}

	return nanoid();
});
</script>
