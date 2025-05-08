<template>
	<div class="flex flex-col gap-8">
		<div class="prose">
			<h3><slot name="title" /></h3>

			<slot name="introduction" />
		</div>

		<div class="p-3 flex justify-end gap-3 border border-grey-300 rounded-md bg-grey-50 text-sm">
			<copy-content v-bind="{ content: copy }" class="button--muted">
				Copy code
			</copy-content>

			<floating-details>
				<template #summary>
					Text slots
				</template>

				<form-layout>
					<form-field v-for="(slot, key) in textSlots" :key="key" v-bind="{ type: slot.type }" v-model="textSlots[key].value">
						{{ slot.label }}
					</form-field>

					<ui-button class="button--muted self-start" icon-start="icon-reload" @click="resetTextSlots">
						Reset content
					</ui-button>
				</form-layout>
			</floating-details>
		</div>

		<div class="inset-shadow-sm p-24 rounded-md border border-grey-300">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { computed, getCurrentInstance, ref, watch } from "vue";
import { deepCopy, get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useStorage } from "@vueuse/core";

const props = defineProps({
	/**
	 * The template ot copy.
	 */
	copy: {
		type: String,
		default: null,
	},
});

// The current Vue instance, which we'll use to automatically determine the
// parent name, simplifying the boilerplate for creating various playgrounds.
const instance = getCurrentInstance();
// We also look for any current values in local storage, so that we can re-use
// those values.
const parentComponentName = get(instance, "parent.type.__name");
// Whether we are able to determine the parent's component name, used to
// namespace any storage.
const haveParentComponentName = computed(() => isNonEmptyString(parentComponentName));

// We define our text slots as our model so that we can easily access their
// values both here and in the parent component.
const textSlots = defineModel({
	type: Object,
});

// Our stored values from last time.
const storedTextSlots = useStorage(`component-playground:${parentComponentName}`, {});

// A copy of the original text slot values. We refer to these if the user
// chooses to reset data later, which is particularly useful if we save data to
// local storage.
const originalTextSlots = ref({});

initialise();

/**
 * Initialise the component, determining the starting data for our text slots.
 */
function initialise() {
	originalTextSlots.value = deepCopy(textSlots.value);

	// If we can't determine a name, we won't be able to reliably retrieve data
	// from storage.
	if (!haveParentComponentName.value || !isNonEmptyObject(storedTextSlots.value)) {
		return;
	}

	// Initialise values from local storage, where possible.
	for (const slotKey in storedTextSlots.value) {
		if (Object.prototype.hasOwnProperty.call(storedTextSlots.value, slotKey)) {
			const storedTextSlot = storedTextSlots.value[slotKey];

			if (!Object.prototype.hasOwnProperty.call(textSlots.value, slotKey)) {
				return;
			}

			const storedTextSlotContent = storedTextSlot.value;

			if (!isNonEmptyString(storedTextSlotContent)) {
				return;
			}

			textSlots.value[slotKey].value = storedTextSlotContent;
		}
	}
}

/**
 * Reset the provided slots to their original value.
 */
function resetTextSlots() {
	textSlots.value = deepCopy(originalTextSlots.value);
}

watch(() => props.modelValue, () => {
	console.log("Text slots changed");
	storedTextSlots.value = textSlots.value;
}, { deep: true });
</script>
