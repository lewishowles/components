<template>
	<div class="flex flex-col gap-1" data-test="none-found">
		<component :is="headingLevel" class="text-2xl font-bold" data-test="none-found-title">
			<slot name="title" />
		</component>

		<slot />

		<div v-if="haveActions" class="flex gap-4 mt-7" data-test="none-found-actions">
			<slot name="actions" />
		</div>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

defineProps({
	/**
	 * The heading level to use for the title.
	 */
	headingLevel: {
		type: String,
		default: "h2",
	},
});

const slots = useSlots();
// Whether any actions have been provided by the user.
const haveActions = computed(() => isNonEmptySlot(slots.actions));
</script>
