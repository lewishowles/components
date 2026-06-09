<template>
	<div>
		<alert-message
			v-if="!haveLabel"
			type="error"
			v-bind="{ live: false }"
			data-test="loading-skeleton-no-label"
		>
			<template #title>&lt;loading-skeleton&gt;</template>

			A `label` is required for accessibility purposes.
		</alert-message>

		<div class="sr-only" aria-live="polite" data-test="loading-skeleton">
			<slot name="label" />
		</div>

		<slot />
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const slots = useSlots();

// Determine if we have a label. If not, show a warning to the user about
// accessibility.
const haveLabel = computed(() => isNonEmptySlot(slots.label));
</script>
