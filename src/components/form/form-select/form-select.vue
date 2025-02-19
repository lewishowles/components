<template>
	<field-wrapper v-bind="{ haveError }" data-test="form-select">
		<form-label v-bind="{ id: inputId, required }">
			<slot />
		</form-label>

		<div class="flex transition-shadow" :class="{ 'form-field--error': haveError }" data-selector="form-field-wrapper" data-test="form-input-wrapper">
			<select
				ref="select-element"
				v-model="model"
				class="form-select"
				v-bind="{
					id: inputId,
					'aria-describedby': describedBy,
					required,
					...inputAttributes,
				}"
			>
				<option v-for="option in internalOptions" :key="option.value" :value="option.value">
					{{ option.label }}
				</option>
			</select>
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
 * A useful wrapper to the `select` tag, providing consistent styling and helpful
 * guard rails, such as automatically linking the field and its label.
 *
 * The `default` slot contains the label for the select.
 * `error` and `help` slots exist for additional descriptive text.
 */
import { computed, useSlots, useTemplateRef } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import useFormSupplementary from "@/components/form/composables/use-form-supplementary";
import useInputId from "@/components/form/composables/use-input-id";

import FieldWrapper from "@/components/form/fragments/field-wrapper/field-wrapper.vue";
import FormLabel from "@/components/form/form-label/form-label.vue";
import FormSupplementary from "@/components/form/fragments/form-supplementary/form-supplementary.vue";

const props = defineProps({
	/**
	 * The options for this select. Options can either be a string, which is
	 * used for both the label and the value, or a `{ label, value }` object,
	 * allowing them to differ.
	 */
	options: {
		type: Array,
		default: () => [],
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
const selectElement = useTemplateRef("select-element");
// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);
// Utilise form supplementary to retrieve the appropriate describedby attribute.
const { updateDescribedBy, describedBy } = useFormSupplementary(inputId.value);
// Whether error text has been provided.
const haveError = computed(() => isNonEmptySlot(slots.error));

// Standardise our input options into { label, value } objects.
const internalOptions = computed(() => {
	if (!isNonEmptyArray(props.options)) {
		return [];
	}

	return props.options.reduce((options, option) => {
		if (isNonEmptyString(option)) {
			options.push({ label: option, value: option });
		}

		if (isNonEmptyObject(option) && Object.hasOwn(option, "label") && Object.hasOwn(option, "value")) {
			options.push(option);
		}

		return options;
	}, []);
});

/**
 * Focus on our input.
 */
function triggerFocus() {
	runComponentMethod(selectElement.value, "focus");
}

defineExpose({
	triggerFocus,
});
</script>
