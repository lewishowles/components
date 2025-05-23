<template>
	<div class="flex flex-wrap items-center gap-4" data-test="form-actions">
		<slot />

		<div v-if="haveTertiaryActions" class="w-full">
			<slot name="tertiary-actions" />
		</div>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const slots = useSlots();

// Whether we have any tertiary actions to display in the form.
const haveTertiaryActions = computed(() => isNonEmptySlot(slots["tertiary-actions"]));
</script>
