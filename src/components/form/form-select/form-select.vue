<template>
	<field-wrapper v-bind="{ haveError }" data-test="form-select">
		<form-label v-bind="{ id: inputId, required }">
			<slot />
		</form-label>

		<conditional-wrapper v-bind="{ wrap: haveIntroduction, tag: 'p' }">
			<slot name="introduction" />
		</conditional-wrapper>

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
				<option v-if="allowEmpty" value="">
					<slot name="empty-option-label">
						Please select…
					</slot>
				</option>
				<option v-for="option in internalOptions" :key="option.value" :value="option.value">
					{{ option.label }}
				</option>
			</select>
		</div>

		<form-supplementary v-bind="{ inputId }" @update:describedby="updateDescribedBy({ haveIntroduction, haveHelp, haveError })">
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
import { firstDefined } from "@lewishowles/helpers/array";
import { get } from "@lewishowles/helpers/object";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";
import useFormSupplementary from "@/components/form/composables/use-form-supplementary/use-form-supplementary";
import useInputId from "@/components/form/composables/use-input-id/use-input-id";
import useOptions from "@/components/form/composables/use-options/use-options";

import FieldWrapper from "@/components/form/fragments/field-wrapper/field-wrapper.vue";
import FormLabel from "@/components/form/form-label/form-label.vue";
import FormSupplementary from "@/components/form/fragments/form-supplementary/form-supplementary.vue";

const props = defineProps({
	/**
	 * The options for this select. Options can be a string, used for both the
	 * label and value, an object containing a "label" and "value", or an object
	 * in conjunction with the `labelKey` and `valueKey` props.
	 */
	options: {
		type: [Array, Object],
		default: () => [],
	},

	/**
	 * The key needed to find each option's label within its object. If an
	 * individual option is a string or number, this is ignored.
	 */
	labelKey: {
		type: String,
		default: "label",
	},

	/**
	 * The key needed to find each option's value within its object. If an
	 * individual option is a string or number, this is ignored.
	 */
	valueKey: {
		type: String,
		default: "value",
	},

	/**
	 * Whether to allow an empty option, the label of which can be provided via
	 * the `empty-option-label` slot..
	 */
	allowEmpty: {
		type: Boolean,
		default: true,
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
	default: "",
});

// A reference to the input, which allows us to trigger focus on it.
const selectElement = useTemplateRef("select-element");
// Standardised options.
const { options: internalOptions } = useOptions(props.options, { labelKey: props.labelKey, valueKey: props.valueKey });
// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);
// Utilise form supplementary to retrieve the appropriate describedby attribute.
const { updateDescribedBy, describedBy } = useFormSupplementary(inputId.value);
// Whether an introduction has been provided.
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));
// Whether help text has been provided.
const haveHelp = computed(() => isNonEmptySlot(slots.help));
// Whether error text has been provided.
const haveError = computed(() => isNonEmptySlot(slots.error));

// When initialising, if we are not allowed an empty option, select the first
// option in the list.
if (props.allowEmpty !== true) {
	model.value = get(firstDefined(internalOptions.value), "value");
}

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
