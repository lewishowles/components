<template>
	<form-input-group
		ref="input-group"
		v-model="internalModel"
		v-bind="{ type: 'radio', required: isRequired, name }"
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

		<template #options="{ options, name }">
			<slot name="options" v-bind="{ options, name }" />
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
import { firstDefined } from "@lewishowles/helpers/array";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyObject, keys, unwrap } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { callComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
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
});

const emit = defineEmits(["update:modelValue"]);
const inputGroupRef = useTemplateRef("input-group");
// The model provided by the input group, which we intend to transform.
const internalModel = ref({});

// Retrieve isFieldRequired from an optional parent form-wrapper. The
// injection may not be defined, so we get it in a safe way.
const isFieldRequired = inject("form-wrapper", {})?.isFieldRequired;

// The field name of our input, preferring the provided name prop, falling
// back to deriving it from the internal model's keys.
const fieldName = computed(() => {
	if (isNonEmptyString(props.name)) {
		return props.name;
	}

	if (!isNonEmptyObject(internalModel.value)) {
		return null;
	}

	return firstDefined(keys(internalModel.value));
});

// The underlying value of our field.
const underlyingValue = computed(() => unwrap(internalModel.value));

// Whether this field is required, from the explicit prop or a `required`
// rule cascaded from the parent form-wrapper, matching form-field.
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
