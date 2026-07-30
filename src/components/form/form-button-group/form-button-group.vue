<template>
	<form-radio-group
		ref="radio-group"
		v-model="model"
		v-bind="{ required }"
		data-component="form-button-group"
		data-test="form-button-group"
	>
		<slot />

		<template #optional-indicator>
			<slot name="optional-indicator" />
		</template>

		<template #option="{ option, selected, id, name }">
			<slot name="option" v-bind="{ option, selected, id, name }">
				<component :is="resolveIconComponent(option.icon)" v-if="option.icon" />

				{{ option.label }}
			</slot>
		</template>

		<template #introduction>
			<slot name="introduction" />
		</template>
		<template #error>
			<slot name="error" />
		</template>
		<template #help>
			<slot name="help" />
		</template>
	</form-radio-group>
</template>

<script setup>
/**
 * Create a group of radio buttons styled as buttons, based on provided options.
 *
 * `form-button-group` allows options to be provided in a few different formats for
 * simplicity.
 */
import { useTemplateRef } from "vue";
import { callComponentMethod } from "@lewishowles/helpers/vue";

import { resolveIconComponent } from "@/utilities/resolve-icon-component/resolve-icon-component.js";

defineProps({
	/**
	 * Whether this field is required.
	 */
	required: {
		type: Boolean,
		default: false,
	},
});

const model = defineModel({
	type: [String, Number],
});

// The underlying radio group, which owns the input focus behaviour.
const radioGroupRef = useTemplateRef("radio-group");

/**
 * Trigger focus on the selected radio button, or the first if no selection has
 * been made.
 */
function triggerFocus() {
	callComponentMethod(radioGroupRef.value, "triggerFocus");
}

defineExpose({
	triggerFocus,
});
</script>
