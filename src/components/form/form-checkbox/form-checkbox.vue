<template>
	<div
		class="flex flex-col gap-1"
		v-bind="{
			'data-checked': model || null,
			'data-indeterminate': indeterminate || null,
			'data-invalid': haveError || null,
		}"
		data-component="form-checkbox"
		data-test="form-checkbox"
	>
		<div class="flex gap-3" :class="{ 'justify-center': !displayLabel }">
			<input
				ref="inputElement"
				v-model="model"
				class="form-checkbox"
				:class="{ 'form-field--error': haveError }"
				v-bind="{
					id: inputId,
					'aria-describedby': describedBy,
					'aria-errormessage': haveError ? errorId : undefined,
					'aria-invalid': haveError ? 'true' : undefined,
					required: required || undefined,
					...inputAttributes,
					type: 'checkbox',
				}"
				data-part="indicator"
			/>

			<form-label
				:class="{ 'sr-only': !displayLabel }"
				v-bind="{ id: inputId, styled: false, required }"
				data-part="label"
			>
				<slot />
			</form-label>
		</div>

		<form-supplementary v-bind="{ inputId }">
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
import { useTemplateRef, watch } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import useFormField from "@/components/form/composables/use-form-field/use-form-field";

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
	 * Any additional attributes to pass to the input itself, such as aria
	 * attributes.
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
	 * Whether to display the checkbox in an indeterminate state. This is useful
	 * when representing a selection state that is neither fully checked nor
	 * fully unchecked, such as a "select all" checkbox when only some items are
	 * selected.
	 */
	indeterminate: {
		type: Boolean,
		default: false,
	},
});

const model = defineModel({
	type: [Boolean, Array],
});

// A reference to the input, which allows us to trigger focus on it.
const inputElement = useTemplateRef("inputElement");

const { inputId, errorId, describedBy, haveHelp, haveError } = useFormField({ id: props.id });

// Set the indeterminate DOM property when the prop changes.
watch(
	[() => props.indeterminate, inputElement],
	([isIndeterminate]) => {
		if (inputElement.value) {
			inputElement.value.indeterminate = isIndeterminate;
		}
	},
	{ immediate: true },
);

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
