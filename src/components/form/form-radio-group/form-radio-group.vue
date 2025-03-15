<template>
	<form-input-group ref="input-group" v-model="internalModel" v-bind="{ type: 'radio' }" data-test="form-radio-group">
		<slot />

		<template #introduction>
			<slot name="introduction" />
		</template>

		<template #options="{ options, name }">
			<slot name="options" v-bind="{ options, name }" />
		</template>

		<template #error>
			<slot name="error" />
		</template>
		<template #help>
			<slot name="help" />
		</template>
	</form-input-group>
</template>

<script setup>
import { computed, ref, useTemplateRef, watch } from "vue";
import { firstDefined } from "@lewishowles/helpers/array";
import { isNonEmptyObject, keys, unwrap } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * Our provided model value for our input. We convert this internally into
	 * something that can be provided to our input group.
	 */
	modelValue: {
		type: [String, Number],
		default: null,
	},
});

const emit = defineEmits(["update:modelValue"]);
const inputGroupRef = useTemplateRef("input-group");
// The model provided by the input group, which we intend to transform.
const internalModel = ref({});

// The field name of our input, determined by the model provided by the parent.
const fieldName = computed(() => {
	if (!isNonEmptyObject(internalModel.value)) {
		return null;
	}

	return firstDefined(keys(internalModel.value));
});

// The underlying value of our field.
const underlyingValue = computed(() => unwrap(internalModel.value));

// When a new value is provided by the input-group, unwrap it and emit it.
watch(internalModel, () => {
	if (!isNonEmptyObject(internalModel.value)) {
		return;
	}

	emit("update:modelValue", underlyingValue.value);
}, { deep: true });

// When the provided modelValue updates, update our internal model to match.
watch(() => props.modelValue, () => {
	if (!isNonEmptyString(fieldName.value)) {
		return;
	}

	if (props.modelValue === underlyingValue.value) {
		return;
	}

	internalModel.value = { [fieldName.value]: props.modelValue };
});

function triggerFocus() {
	runComponentMethod(inputGroupRef.value, "triggerFocus");
}

defineExpose({
	triggerFocus,
});
</script>
