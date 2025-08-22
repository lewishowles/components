<template>
	<div class="flex flex-col gap-8" v-bind="{ id }">
		<div v-if="haveTitle || haveIntroduction" class="prose dark:prose-invert">
			<section-title v-if="haveTitle" v-bind="{ id }">
				<template #title>
					<slot name="title" />
				</template>
			</section-title>

			<slot name="introduction" />
		</div>

		<div class="flex flex-col gap-8">
			<div class="p-3 flex justify-end gap-3 border border-grey-200 rounded-md bg-grey-50 backdrop-blur-sm dark:bg-grey-950/20 dark:border-transparent text-sm" :class="{ 'z-10': isTextSlotsOpen }">
				<copy-content v-bind="{ content: copy }" class="button--muted">
					Copy code
				</copy-content>

				<floating-details v-show="!useTranslation && haveTextSlots" v-model="isTextSlotsOpen">
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

			<div class="relative inset-shadow-sm p-24 rounded-md border border-grey-300 dark:border-white/20">
				<slot />

				<div v-if="haveComponentModel" class="relative mt-12 rounded-md bg-grey-50 dark:bg-grey-950/30 dark:text-grey-200 border border-grey-200 dark:border-transparent text-grey-800 p-6">
					<pill-badge class="absolute top-0 start-0 ms-6 -translate-y-1/2">
						Model value
					</pill-badge>

					<pre>{{ componentModel }}</pre>
				</div>
			</div>
		</div>

		<div>
			<code-block>{{ copy }}</code-block>

			<slot name="additional-code" />
		</div>
	</div>
</template>

<script setup>
import { computed, getCurrentInstance, inject, ref, useSlots, watch } from "vue";
import { deepCopy, get, isNonEmptyObject, isObject } from "@lewishowles/helpers/object";
import { getSlotText, isNonEmptySlot } from "@lewishowles/helpers/vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useStorage } from "@vueuse/core";
import useTranslationMode from "@/docs/composables/use-translation-mode/use-translation-mode";

import SectionTitle from "../section-title/section-title.vue";

const props = defineProps({
	/**
	 * The ID of this section, allow it to be linked to.
	 */
	id: {
		type: String,
		default: null,
	},

	/**
	 * The template to copy.
	 */
	copy: {
		type: String,
		default: null,
	},

	/**
	 * The current model value of the component being represented. If present,
	 * will be displayed alongside the code.
	 */
	componentModel: {
		type: [String, Object, Boolean, Array],
		default: null,
	},
});

const { registerSection } = inject("component-tab");

// Whether a component model value has been provided.
const haveComponentModel = computed(() => {
	if (typeof props.componentModel === "boolean") {
		return true;
	}

	if (typeof props.componentModel === "string") {
		return isNonEmptyString(props.componentModel);
	}

	if (Array.isArray(props.componentModel)) {
		return isNonEmptyArray(props.componentModel);
	}

	if (isObject(props.componentModel)) {
		return isNonEmptyObject(props.componentModel);
	}

	if (props.componentModel !== null) {
		return true;
	}

	return false;
});

const slots = useSlots();
// Whether a title has been provided
const haveTitle = computed(() => isNonEmptySlot(slots.title));
// The text contained in our title slot.
const titleText = computed(() => getSlotText(slots.title));
// Whether an introduction has been provided
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));
// The current Vue instance, which we'll use to automatically determine the
// parent name, simplifying the boilerplate for creating various playgrounds.
const instance = getCurrentInstance();
// We also look for any current values in local storage, so that we can re-use
// those values.
const parentComponentName = get(instance, "parent.type.__name");
// Whether we are able to determine the parent's component name, used to
// namespace any storage.
const haveParentComponentName = computed(() => isNonEmptyString(parentComponentName));
// Whether the user is using translation mode.
const { useTranslation } = useTranslationMode();

// We define our text slots as our model so that we can easily access their
// values both here and in the parent component.
const textSlots = defineModel({
	type: Object,
});

// Whether any text slots are present.
const haveTextSlots = computed(() => isNonEmptyObject(textSlots.value));

// Our stored values from last time.
const storedTextSlots = useStorage(`component-playground:${parentComponentName}`, {});

// A copy of the original text slot values. We refer to these if the user
// chooses to reset data later, which is particularly useful if we save data to
// local storage.
const originalTextSlots = ref({});

// Whether the text slots details is open.
const isTextSlotsOpen = ref(false);

registerSection({ id: props.id, title: titleText.value });

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
		if (!Object.prototype.hasOwnProperty.call(storedTextSlots.value, slotKey)) {
			return;
		}

		if (!Object.prototype.hasOwnProperty.call(textSlots.value, slotKey)) {
			return;
		}

		const storedTextValue = storedTextSlots.value[slotKey];

		if (!isNonEmptyString(storedTextValue)) {
			return;
		}

		textSlots.value[slotKey].value = storedTextValue;
	}
}

/**
 * Reset the provided slots to their original value.
 */
function resetTextSlots() {
	textSlots.value = deepCopy(originalTextSlots.value);
}

// When the text slots change (modelValue under the hood), update our stored
// slot values.
watch(() => props.modelValue, () => {
	// Before we store our slots, we remove any extraneous information for
	// brevity.
	storedTextSlots.value = Object.fromEntries(
		Object.entries(textSlots.value).map(([key, slot]) => [key, slot.value]),
	);
}, { deep: true });
</script>
