<template>
	<div role="group" v-bind="{ 'aria-labelledby': haveLabelSlot ? internalId : null }" class="flex flex-wrap items-center gap-4" data-test="form-actions">
		<span v-if="haveLabelSlot" v-bind="{ id: internalId }" class="sr-only">
			<slot name="label" />
		</span>

		<slot />

		<div v-if="haveTertiaryActions" class="w-full">
			<slot name="tertiary-actions" />
		</div>
	</div>
</template>

<script setup>
import { computed, useId, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const slots = useSlots();

// An internal ID linking the group to its label when one is provided.
const internalId = useId();

// Whether a label slot has been provided for this group.
const haveLabelSlot = computed(() => isNonEmptySlot(slots.label));
// Whether we have any tertiary actions to display in the form.
const haveTertiaryActions = computed(() => isNonEmptySlot(slots["tertiary-actions"]));
</script>
