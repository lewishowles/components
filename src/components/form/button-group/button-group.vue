<template>
	<form-radio-group data-test="button-group">
		<slot />

		<template #options="{ options, name }">
			<slot name="options" v-bind="{ options, name }">
				<div ref="optionsWrapperElement" class="flex mt-1">
					<div v-for="option in options" :key="option.id">
						<input ref="inputReferences" v-model="model" type="radio" class="peer sr-only" v-bind="{ id: option.id, value: option.value, name }" />

						<form-label
							v-bind="{ id: option.id, styled: false }"
							class="button-group flex items-center gap-2"
							:class="{
								'button-group--middle': !option.first,
								'button-group--first': option.first,
								'button-group--last': option.last,
							}"
						>
							<component :is="option.icon" v-if="option.icon" />

							{{ option.label }}
						</form-label>
					</div>
				</div>
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
 * `button-group` allows options to be provided in a few different formats for
 * simplicity.
 */
import { head, isNonEmptyArray } from "@lewishowles/helpers/array";
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

import FormLabel from "@/components/form/form-label/form-label.vue";

const model = defineModel({
	type: [String, Number],
});

// A reference to the inputs, allowing us to trigger focus.
const inputReferences = ref([]);
// The element wrapping our options template, which allows us to determine which
// radio button is checked and focus the appropriate label.
const optionsWrapperElement = ref(null);

/**
 * Trigger focus on the selected radio button, or the first if no selection has
 * been made. Because we're using `form-radio` for the heavy lifting, but
 * overriding the template, we don't simply have access to the options, so we're
 * determining the selection via the HTML instead of passing those options
 * around.
 */
function triggerFocus() {
	if (!isNonEmptyArray(inputReferences.value)) {
		return;
	}

	const selectedOption = optionsWrapperElement.value.querySelector(":checked");

	if (selectedOption) {
		runComponentMethod(selectedOption, "focus");

		return;
	}

	focusFirstInput();
}

/**
 * Focus the first input of the group.
 */
function focusFirstInput() {
	const input = head(inputReferences.value);

	runComponentMethod(input, "focus");
}

defineExpose({
	triggerFocus,
});
</script>
