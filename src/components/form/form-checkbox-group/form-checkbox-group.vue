<template>
	<form-input-group ref="input-group" v-model="internalModel" v-bind="{ type: 'checkbox' }" data-test="form-checkbox-group">
		<slot />

		<template #introduction>
			<slot name="introduction" />
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
import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject, keys } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { ref, useTemplateRef, watch } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * Our provided model value for our input. We convert this internally into
	 * something that can be provided to our input group.
	 */
	modelValue: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(["update:modelValue"]);
const inputGroupRef = useTemplateRef("input-group");
// The model provided by the input group, which we intend to transform.
const internalModel = ref({});

// When a new value is provided by the input-group, convert it and emit it.
watch(internalModel, () => {
	if (!isNonEmptyObject(internalModel.value)) {
		return;
	}

	// We attempt to make sure that the model has changed before emitting a new
	// one, to avoid any infinite loops.
	const selectedKeys = keys(internalModel.value).filter(key => internalModel.value[key]);

	if (arrayLength(selectedKeys) !== arrayLength(props.modelValue) || selectedKeys.some((key, index) => key !== props.modelValue[index])) {
		emit("update:modelValue", selectedKeys);
	}
}, { deep: true });

// When the provided modelValue updates, update our internal model to match.
watch(() => props.modelValue, () => {
	if (!isNonEmptyArray(props.modelValue)) {
		internalModel.value = {};
	}

	// Since we avoid infinite loops when watching internalModel, we don't need
	// to worry too much about over-checking here.
	const values = props.modelValue.filter(item => isNonEmptyString(item));

	const objectValues = values.reduce((objectValues, value) => {
		objectValues[value] = true;

		return objectValues;
	}, {});

	internalModel.value = objectValues;
});

function triggerFocus() {
	runComponentMethod(inputGroupRef.value, "triggerFocus");
}

defineExpose({
	triggerFocus,
});
</script>
