<template>
	<field-wrapper
		v-bind="{
			tag: 'fieldset',
			haveError,
			'aria-describedby': describedBy,
			'aria-errormessage': haveError ? errorId : null,
			'aria-invalid': haveError ? 'true' : null,
			'aria-required': required ? 'true' : null,
			'data-invalid': haveError || null,
		}"
		class="@container"
		data-component="form-input-group"
		data-test="form-input-group"
	>
		<div class="flex flex-col">
			<form-label v-bind="{ tag: 'legend', required, showOptionalIndicator: !isCheckbox }">
				<slot />

				<template #optional-indicator>
					<slot name="optional-indicator" />
				</template>
			</form-label>

			<conditional-wrapper
				v-bind="{ wrap: haveIntroduction, tag: 'p' }"
				data-test="form-input-group-introduction"
			>
				<slot name="introduction" />
			</conditional-wrapper>
		</div>

		<div
			:class="cn('mt-2 mb-1 flex', optionsClasses)"
			:data-layout="inline ? 'inline' : 'stacked'"
			data-part="options"
			data-test="form-input-group-options"
		>
			<template v-for="option in internalOptions" :key="option.id">
				<div
					:class="cn('group flex', optionClasses)"
					v-bind="{
						'data-position': getOptionPosition(option),
						'data-state': isOptionSelected(option) ? 'selected' : 'unselected',
						'data-variant': isCard ? 'card' : null,
					}"
					data-part="option"
					data-test="form-input-group-option"
				>
					<input
						v-if="isRadio"
						ref="inputReferences"
						v-model="model[fieldName]"
						type="radio"
						v-bind="{
							id: option.id,
							value: option.value,
							name: fieldName,
						}"
						class="form-radio shrink-0"
						data-part="indicator"
					/>

					<input
						v-else-if="isCheckbox"
						ref="inputReferences"
						v-model="model[option.value]"
						type="checkbox"
						v-bind="{
							id: option.id,
							value: option.value,
							name: fieldName,
						}"
						class="form-checkbox shrink-0"
						data-part="indicator"
					/>

					<form-label
						v-bind="{ id: option.id, styled: false, showOptionalIndicator: false }"
						class="w-full"
						data-part="label"
					>
						<slot
							name="option"
							v-bind="{
								option,
								selected: isOptionSelected(option),
								id: option.id,
								name: fieldName,
							}"
						>
							<span>{{ option.label }}</span>

							<span
								v-if="option.description"
								class="text-content-muted block leading-5"
								data-test="form-input-group-option-description"
							>
								{{ option.description }}
							</span>
						</slot>
					</form-label>
				</div>
			</template>
		</div>

		<form-supplementary v-bind="{ inputId }" class="mt-1">
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
 * Create a group of inputs (radio buttons or checkboxes) based on provided
 * options.
 *
 * `form-input-group` allows options to be provided in a few different formats
 * for simplicity.
 */
import { computed, ref } from "vue";
import { head, isNonEmptyArray } from "@lewishowles/helpers/array";
import { callComponentMethod } from "@lewishowles/helpers/vue";
import { cn } from "@/utilities/cn.js";
import useFormField from "@/components/form/composables/use-form-field/use-form-field";
import useOptions from "@/components/form/composables/use-options/use-options";

import FieldWrapper from "@/components/form/fragments/field-wrapper/field-wrapper.vue";
import FormLabel from "@/components/form/form-label/form-label.vue";
import FormSupplementary from "@/components/form/fragments/form-supplementary/form-supplementary.vue";

const props = defineProps({
	/**
	 * The type of input to use for this group: "radio" or "checkbox"
	 */
	type: {
		type: String,
		default: null,
	},

	/**
	 * The options for this group. Options can be a string, used for both the
	 * label and value, an object containing a "label" and "value", or an object
	 * in conjunction with the `labelKey` and `valueKey` props.
	 */
	options: {
		type: [Array, Object],
		required: true,
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
	 * The key needed to find each option's description within its object.
	 */
	descriptionKey: {
		type: String,
		default: "description",
	},

	/**
	 * A name for this input group. If not set, the input ID is used.
	 */
	name: {
		type: String,
		default: null,
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
	 * Whether to display options inline (horizontally). This is only
	 * recommended when there are two to three options. Any more than that, and
	 * vertical display is more clear for the user.
	 */
	inline: {
		type: Boolean,
		default: false,
	},

	/**
	 * The visual treatment to apply to each option.
	 */
	variant: {
		type: String,
		default: null,
	},

	/**
	 * Additional classes to merge onto every option row. Accepts strings,
	 * arrays, or conditional objects, matching Vue class bindings.
	 */
	optionClasses: {
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * Additional classes to merge onto the options wrapper around option rows.
	 * Accepts strings, arrays, or conditional objects, matching Vue class
	 * bindings.
	 */
	optionsClasses: {
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * Whether this field group is required.
	 */
	required: {
		type: Boolean,
		default: false,
	},
});

// The internal model for an input group is always an object, and the parent
// component which imposes a particular type can determine the most reasonable
// way to modify that if necessary.
const model = defineModel({
	type: Object,
	default: {},
});

// Whether this is a radio group variant
const isRadio = computed(() => props.type === "radio");
// Whether this is a checkbox variant
const isCheckbox = computed(() => props.type === "checkbox");
// Whether this group uses the card option treatment.
const isCard = computed(() => props.variant === "card");

// Standardised options.
const { options: internalOptions } = useOptions(props.options, {
	descriptionKey: props.descriptionKey,
	labelKey: props.labelKey,
	valueKey: props.valueKey,
});

const { inputId, errorId, describedBy, haveIntroduction, haveHelp, haveError } = useFormField({
	id: props.id,
});

// The computed name of this field, either the one provided, or one generated
// for the user.
const fieldName = computed(() => props.name || inputId.value);
// A reference to the inputs, allowing us to trigger focus.
const inputReferences = ref([]);

/**
 * Whether an option is selected in the current model.
 *
 * @param  {object}  option
 *   The option to check.
 * @returns {boolean}
 *   Whether the option is selected.
 */
function isOptionSelected(option) {
	if (isRadio.value) {
		return model.value[fieldName.value] === option.value;
	}

	return Boolean(model.value[option.value]);
}

/**
 * Describe where an option appears in its group for stable styling hooks.
 *
 * @param  {object}  option
 *   The option with position information.
 * @returns {string}
 *   The option position within its group.
 */
function getOptionPosition(option) {
	if (option.first && option.last) {
		return "only";
	}

	if (option.first) {
		return "first";
	}

	if (option.last) {
		return "last";
	}

	return "middle";
}

/**
 * Trigger focus on the selected input, or the first if no selection has been
 * made.
 */
function triggerFocus() {
	if (!isNonEmptyArray(inputReferences.value)) {
		return;
	}

	// If we have a current value, focus that input instead.
	if (model.value === undefined) {
		focusFirstInput();

		return;
	}

	const selectedIndex = internalOptions.value.findIndex((option) => option.value === model.value);

	if (selectedIndex !== -1) {
		callComponentMethod(inputReferences.value[selectedIndex], "focus");

		return;
	}

	focusFirstInput();
}

/**
 * Focus the first input of the group.
 */
function focusFirstInput() {
	const input = head(inputReferences.value);

	callComponentMethod(input, "focus");
}

defineExpose({
	triggerFocus,
});
</script>
