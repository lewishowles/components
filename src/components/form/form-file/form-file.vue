<template>
	<field-wrapper
		v-bind="{ haveError, 'data-invalid': haveError || null }"
		data-component="form-file"
		data-test="form-file"
	>
		<div class="flex flex-col">
			<form-label v-bind="{ id: inputId, required, showOptionalIndicator }">
				<slot />

				<template #optional-indicator>
					<slot name="optional-indicator" />
				</template>
			</form-label>

			<conditional-wrapper
				v-bind="{ id: introductionId, wrap: haveIntroduction, tag: 'p' }"
				data-test="form-file-introduction"
			>
				<slot name="introduction" />
			</conditional-wrapper>
		</div>

		<div
			class="flex flex-col items-start gap-2"
			data-part="controls"
			data-test="form-file-controls"
		>
			<input
				ref="inputElement"
				class="form-file-input"
				:class="{ 'form-field--error': haveError }"
				v-bind="inputElementAttributes"
				@change="handleChange"
			/>

			<ui-button
				v-if="haveFile"
				class="button--ghost"
				data-part="remove"
				icon-start="icon-bin"
				@click="removeFile"
			>
				<slot name="remove-button-label" v-bind="{ files: selectedFiles }">
					<template v-if="!multiple || selectedFiles.length === 1">
						Remove {{ firstFileName }}
					</template>
					<template v-else>Remove {{ selectedFiles.length }} files</template>
				</slot>
			</ui-button>
		</div>

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
 * A file upload field supporting single or multiple file selection.
 *
 * The default slot contains the input label. Other slots customise the
 * optional indicator, introduction, error, help text, and remove button label.
 */
import { computed, nextTick, useTemplateRef, watch } from "vue";
import { ensureArray } from "@lewishowles/helpers/array";
import { callComponentMethod } from "@lewishowles/helpers/vue";
import useFormField from "@/components/form/composables/use-form-field/use-form-field";

const props = defineProps({
	/**
	 * The input ID. A unique ID is generated when omitted.
	 */
	id: {
		type: String,
		default: null,
	},

	/**
	 * Whether to allow selecting more than one file.
	 */
	multiple: {
		type: Boolean,
		default: false,
	},

	/**
	 * Additional attributes for the native input, such as `accept` or
	 * `aria-labelledby`. Component-managed attributes take precedence; custom
	 * `aria-describedby` values are merged with generated description IDs.
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
	 * Whether to show optional text when the field is not required.
	 */
	showOptionalIndicator: {
		type: Boolean,
		default: true,
	},
});

const model = defineModel({
	type: [File, Array],
	default: null,
});

// The native input used for direct clearing and focus.
const inputElement = useTemplateRef("inputElement");

const { inputId, introductionId, errorId, describedBy, haveIntroduction, haveError } = useFormField(
	{
		id: props.id,
	},
);

// Attributes generated for the native input, with component contracts taking precedence.
const inputElementAttributes = computed(() => {
	const customDescribedBy = props.inputAttributes?.["aria-describedby"];
	const describedByValue = [describedBy.value, customDescribedBy].filter(Boolean).join(" ");

	return {
		...props.inputAttributes,
		type: "file",
		id: inputId.value,
		"aria-describedby": describedByValue || undefined,
		"aria-errormessage": haveError.value ? errorId.value : undefined,
		"aria-invalid": haveError.value ? "true" : undefined,
		multiple: props.multiple || undefined,
		required: props.required || undefined,
	};
});

// The selected files, normalised for both model shapes.
const selectedFiles = computed(() => (model.value ? ensureArray(model.value) : []));

// The first selected filename, used for single-file labels.
const firstFileName = computed(() => selectedFiles.value[0]?.name);

// Whether one or more files are currently selected.
const haveFile = computed(() => selectedFiles.value.length > 0);

// A file input can't be set programmatically, so clear it directly when the
// model is reset externally (e.g. a form reset).
watch(model, (value) => {
	if ((!value || (Array.isArray(value) && value.length === 0)) && inputElement.value) {
		inputElement.value.value = "";
	}
});

/**
 * Update the model with the newly selected file, if any.
 *
 * @param  {Event}  event
 *     The native `change` event from the file input.
 */
function handleChange(event) {
	const files = Array.from(event.target.files ?? []);

	if (props.multiple) {
		model.value = files.length ? files : null;

		return;
	}

	model.value = files[0] ?? null;
}

/**
 * Clear the current selection, allowing the same file to be reselected.
 */
async function removeFile() {
	model.value = null;

	await nextTick();

	triggerFocus();
}

/**
 * Focus the native input.
 */
function triggerFocus() {
	callComponentMethod(inputElement.value, "focus");
}

defineExpose({
	triggerFocus,
});
</script>
