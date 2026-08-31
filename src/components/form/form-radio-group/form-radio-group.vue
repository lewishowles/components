<template>
	<form-input-group
		ref="input-group"
		v-model="internalModel"
		v-bind="{
			id: inputId,
			type: 'radio',
			required: isRequired,
			name,
			descriptionKey,
			variant,
			optionClasses,
			optionsClasses,
		}"
		data-component="form-radio-group"
		data-test="form-radio-group"
	>
		<slot />

		<template #optional-indicator>
			<slot name="optional-indicator" />
		</template>

		<template #introduction>
			<slot name="introduction" />
		</template>

		<template #option="{ option, selected, id, name }">
			<slot name="option" v-bind="{ option, selected, id, name }" />
		</template>

		<template #help>
			<slot name="help" />
		</template>

		<template #error>
			<slot name="error" />
		</template>
	</form-input-group>
</template>

<script setup>
import { computed, inject, ref, useTemplateRef, watch } from "vue";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyObject, unwrap } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { callComponentMethod } from "@lewishowles/helpers/vue";
import useFormField from "@/components/form/composables/use-form-field/use-form-field";

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
	 * Our provided model value for our input. We convert this internally into
	 * something that can be provided to our input group.
	 */
	modelValue: {
		type: [String, Number],
		default: null,
	},

	/**
	 * Whether this field is required. This is also set automatically when a
	 * `required` validation rule is present on the parent `form-wrapper`.
	 */
	required: {
		type: Boolean,
		default: false,
	},

	/**
	 * A name for this radio group. If not set, the input ID is used.
	 */
	name: {
		type: String,
		default: null,
	},

	/**
	 * The key needed to find each option's description within its object.
	 */
	descriptionKey: {
		type: String,
		default: "description",
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
});

const emit = defineEmits(["update:modelValue"]);
const inputGroupRef = useTemplateRef("input-group");
// The model provided by the input group, which we intend to transform.
const internalModel = ref({});
// Access to shared form field boilerplate.
const { inputId } = useFormField({ id: props.id });

// Retrieve isFieldRequired from an optional parent form host.
const { isFieldRequired } = inject("form", {});

// The field name of our input, preferring the provided name prop.
const fieldName = computed(() => props.name || inputId.value);

// The underlying value of our field.
const underlyingValue = computed(() => unwrap(internalModel.value));

// Whether this field is required, from the explicit prop or a `required`
// rule cascaded from the parent form host, matching form-field.
const isRequired = computed(() => {
	if (props.required) {
		return true;
	}

	return isFunction(isFieldRequired) && isFieldRequired(fieldName.value);
});

// When a new value is provided by the input-group, unwrap it and emit it.
watch(
	internalModel,
	() => {
		if (!isNonEmptyObject(internalModel.value)) {
			return;
		}

		emit("update:modelValue", underlyingValue.value);
	},
	{ deep: true },
);

// When the provided modelValue updates, update our internal model to match.
watch(
	() => props.modelValue,
	() => {
		if (!isNonEmptyString(fieldName.value)) {
			return;
		}

		if (props.modelValue === underlyingValue.value) {
			return;
		}

		internalModel.value = { [fieldName.value]: props.modelValue };
	},
	{ immediate: true },
);

function triggerFocus() {
	callComponentMethod(inputGroupRef.value, "triggerFocus");
}

defineExpose({
	triggerFocus,
});
</script>
