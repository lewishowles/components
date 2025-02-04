<template>
	<div class="flex flex-col gap-1" data-test="form-checkbox">
		<div class="flex gap-3" :class="{ 'justify-center': !displayLabel }">
			<input
				ref="inputElement"
				v-model="model"
				class="form-checkbox"
				:class="{ 'form-input--error': haveError }"
				v-bind="{
					id: inputId,
					'aria-describedby': describedBy,
					...inputAttributes,
					type: 'checkbox',
				}"
			/>

			<form-label :class="{ 'sr-only': !displayLabel }" v-bind="{ id: inputId, styled: false }">
				<slot />
			</form-label>
		</div>

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
 * A useful wrapper to the `input[type="checkbox"]` tag, providing consistent
 * styling and helpful guard rails, such as automatically linking the field and
 * its label.
 *
 * The `default` slot contains the label for the checkbox. `error` and `help`
 * slots exist for additional descriptive text.
 */
import { computed, useSlots, useTemplateRef } from "vue";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import useFormSupplementary from "@/components/form/composables/use-form-supplementary";
import useInputId from "@/components/form/composables/use-input-id";

import FormLabel from "@/components/form/form-label/form-label.vue";
import FormSupplementary from "@/components/form/fragments/form-supplementary/form-supplementary.vue";

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
	 * Whether to display the label. A label is still required for accessibility
	 * purposes.
	 */
	displayLabel: {
		type: Boolean,
		default: true,
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
	 * Any additional attributes to pass to the input itself, such as aria
	 * attributes.
	 */
	inputAttributes: {
		type: Object,
		default: null,
	},
});

const slots = useSlots();

const model = defineModel({
	type: [Boolean, Array],
});

// A reference to the input, which allows us to trigger focus on it.
const inputElement = useTemplateRef("inputElement");
// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);
// Utilise form supplementary to retrieve the appropriate describedby attribute.
const { updateDescribedBy, describedBy } = useFormSupplementary(inputId.value);
// Whether error text has been provided.
const haveError = computed(() => isNonEmptySlot(slots.error));

/**
 * Focus on our input.
 */
function triggerFocus() {
	runComponentMethod(inputElement.value, "focus");
}

defineExpose({
	triggerFocus,
});
</script>
