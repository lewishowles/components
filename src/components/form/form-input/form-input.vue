<template>
	<div class="flex flex-col gap-1" data-test="form-input">
		<form-label v-bind="{ id: inputId, required }">
			<slot />
		</form-label>

		<div class="flex transition-shadow" :class="{ 'form-input--error': haveError }" data-test="form-input-wrapper">
			<input
				ref="inputElement"
				v-model="model"
				class="form-input"
				:class="{
					'rounded-s-none': havePrefix,
					'rounded-e-none': haveSuffix,
				}"
				v-bind="{
					id: inputId,
					placeholder,
					'aria-describedby': describedBy,
					...inputAttributes,
				}"
			/>

			<form-prefix v-if="havePrefix" class="order-first">
				<slot name="prefix" />
			</form-prefix>

			<form-suffix v-if="haveSuffix">
				<slot name="suffix" />
			</form-suffix>
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
 * A useful wrapper to the `input` tag, providing consistent styling and helpful
 * guard rails, such as automatically linking the field and its label.
 *
 * The `default` slot contains the label for the input.
 * `prefix` and `suffix` slots exist for placing elements beside the input.
 * `error` and `help` slots exist for additional descriptive text.
 */
import { computed, useSlots, useTemplateRef } from "vue";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import useFormSupplementary from "@/components/form/composables/use-form-supplementary";
import useInputId from "@/components/form/composables/use-input-id";

import FormLabel from "@/components/form/form-label/form-label.vue";
import FormPrefix from "@/components/form/form-prefix/form-prefix.vue";
import FormSuffix from "@/components/form/form-suffix/form-suffix.vue";
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
	 * Any additional attributes to pass to the input itself, such as
	 * `autocomplete`.
	 */
	inputAttributes: {
		type: Object,
		default: null,
	},

	/**
	 * Whether this field is required. If not required, a field's label is
	 * updated with `optional` text.
	 */
	required: {
		type: Boolean,
		default: false,
	},
});

const slots = useSlots();

const model = defineModel({
	type: String,
});

// A reference to the input, which allows us to trigger focus on it.
const inputElement = useTemplateRef("inputElement");
// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);
// Utilise form supplementary to retrieve the appropriate describedby attribute.
const { updateDescribedBy, describedBy } = useFormSupplementary(inputId.value);
// Whether a prefix is defined.
const havePrefix = computed(() => isNonEmptySlot(slots.prefix));
// Whether a suffix is defined.
const haveSuffix = computed(() => isNonEmptySlot(slots.suffix));
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
