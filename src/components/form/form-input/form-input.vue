<template>
	<field-wrapper
		v-bind="{ haveError, 'data-invalid': haveError || null }"
		data-component="form-input"
		data-test="form-input"
	>
		<div class="flex flex-col">
			<form-label v-bind="{ id: inputId, required }">
				<slot />

				<template #optional-indicator>
					<slot name="optional-indicator" />
				</template>
			</form-label>

			<conditional-wrapper
				v-bind="{ id: introductionId, wrap: haveIntroduction, tag: 'p' }"
				data-test="form-input-introduction"
			>
				<slot name="introduction" />
			</conditional-wrapper>
		</div>

		<div
			class="flex transition-shadow"
			:class="{ 'form-field--error': haveError }"
			data-part="field-wrapper"
			data-test="form-input-wrapper"
		>
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
					'aria-errormessage': haveError ? errorId : undefined,
					'aria-invalid': haveError ? 'true' : undefined,
					list: haveSuggestions ? datalistId : undefined,
					required,
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

		<datalist v-if="haveSuggestions" v-bind="{ id: datalistId }">
			<option v-for="suggestion in suggestions" :key="suggestion" v-bind="{ value: suggestion }" />
		</datalist>

		<form-supplementary v-bind="{ inputId }">
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
 * A useful wrapper to the `input` tag, providing consistent styling and helpful
 * guard rails, such as automatically linking the field and its label.
 *
 * The `default` slot contains the label for the input.
 * `prefix` and `suffix` slots exist for placing elements beside the input.
 * `error` and `help` slots exist for additional descriptive text.
 */
import { computed, useId, useSlots, useTemplateRef } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptySlot, callComponentMethod } from "@lewishowles/helpers/vue";
import useFormField from "@/components/form/composables/use-form-field/use-form-field";

import FieldWrapper from "@/components/form/fragments/field-wrapper/field-wrapper.vue";
import FormLabel from "@/components/form/form-label/form-label.vue";
import FormPrefix from "@/components/form/fragments/form-prefix/form-prefix.vue";
import FormSuffix from "@/components/form/fragments/form-suffix/form-suffix.vue";
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

	/**
	 * A list of suggestions to display to the user as they type, rendered
	 * as a datalist linked to this input. Users can select from the list or
	 * ignore it and enter their own value.
	 */
	suggestions: {
		type: Array,
		default: null,
	},
});

const slots = useSlots();

const model = defineModel({
	type: String,
});

// A reference to the input, which allows us to trigger focus on it.
const inputElement = useTemplateRef("inputElement");
// An ID linking the input to its datalist when suggestions are provided.
const datalistId = useId();

const { inputId, introductionId, errorId, describedBy, haveIntroduction, haveHelp, haveError } =
	useFormField({ id: props.id });

// Whether suggestions have been provided for the datalist.
const haveSuggestions = computed(() => isNonEmptyArray(props.suggestions));
// Whether a prefix is defined.
const havePrefix = computed(() => isNonEmptySlot(slots.prefix));
// Whether a suffix is defined.
const haveSuffix = computed(() => isNonEmptySlot(slots.suffix));

/**
 * Focus on our input.
 */
function triggerFocus() {
	callComponentMethod(inputElement.value, "focus");
}

defineExpose({
	triggerFocus,
});
</script>
