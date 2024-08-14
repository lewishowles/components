<template>
	<div v-if="!haveLabel" class="flex items-center gap-2 text-red-800">
		<icon-danger class="stroke-current" />
		<strong>&lt;form-label&gt;</strong>
		A label is required for accessibility purposes.
	</div>

	<label v-bind="{ for: id }" class="font-medium text-grey-900" :class="{ 'sr-only': hidden }" data-test="form-label">
		<slot />
	</label>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

defineProps({
	/**
	 * The ID of the input that this label belongs to.
	 */
	id: {
		type: String,
		required: true,
	},

	/**
	 * Whether this label is visually hidden. Labels are never hidden from
	 * screen readers because of the value they provide.
	 */
	hidden: {
		type: Boolean,
		default: false,
	},
});

const slots = useSlots();
// A simple check to determine if we have a label. If not, show a warning to the
// user about accessibility.
const haveLabel = computed(() => isNonEmptySlot(slots.default));
</script>
