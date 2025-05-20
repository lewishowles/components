<template>
	<field-wrapper v-bind="{ haveError }" data-test="form-textarea">
		<form-label v-bind="{ id: inputId, required }">
			<slot />
		</form-label>

		<conditional-wrapper v-bind="{ wrap: haveIntroduction, tag: 'p' }">
			<slot name="introduction" />
		</conditional-wrapper>

		<div class="flex transition-shadow" :class="{ 'form-field--error': haveError }" data-selector="form-field-wrapper" data-test="form-input-wrapper">
			<textarea
				ref="inputElement"
				v-model="model"
				class="form-input"
				v-bind="{
					id: inputId,
					placeholder,
					'aria-describedby': describedBy,
					required,
					...inputAttributes,
				}"
			/>
		</div>

		<form-supplementary v-bind="{ inputId }" @update:describedby="updateDescribedBy">
			<template #error>
				<slot name="error" />
			</template>
			<template #help>
				<slot name="help" />
			</template>
		</form-supplementary>
	</field-wrapper>
</template>

<script setup>
/**
 * A useful wrapper to the `textarea` tag, providing consistent styling and
 * helpful guard rails, such as automatically linking the field and its label.
 *
 * The `default` slot contains the label for the input. `error` and `help` slots
 * exist for additional descriptive text.
 *
 * We don't attempt to re-use the `form-input` component with a different tag in
 * order to keep things compartmentalised, and because the `form-input` has more
 * features than the textarea (such as prefix and suffix). While the
 * `form-input` itself could use this component as a base, it doesn't feel like
 * a natural extension, and attempting to shoe-horn the prefix/suffix in would
 * remove some of the benefits of inheritance.
 */
import { computed, useSlots, useTemplateRef } from "vue";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import useFormSupplementary from "@/components/form/composables/use-form-supplementary";
import useInputId from "@/components/form/composables/use-input-id";

import FieldWrapper from "@/components/form/fragments/field-wrapper/field-wrapper.vue";
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
	 * Whether this field is required.
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
// Whether an introduction has been provided.
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));
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
