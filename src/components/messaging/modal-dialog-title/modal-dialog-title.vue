<template>
	<component
		:is="tag"
		:id="titleId"
		tabindex="-1"
		autofocus
		class="text-content-strong mb-6 text-2xl font-bold"
		data-test="modal-dialog-title"
	>
		<slot />
		<div v-if="haveSubtitle" data-part="subtitle" class="text-content-muted text-lg font-normal">
			<slot name="subtitle" />
		</div>
	</component>
</template>

<script setup>
import { computed, inject, useId, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

defineProps({
	/**
	 * The tag to use for this title.
	 */
	tag: {
		type: String,
		default: "h2",
	},
});

const slots = useSlots();

// The id injected from the parent modal-dialog, used to link aria-labelledby on
// the dialog element.
const titleId = inject("modal-dialog-title-id", useId());

const haveSubtitle = computed(() => isNonEmptySlot(slots.subtitle));
</script>
