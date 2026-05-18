<template>
	<component
		:is="tag"
		:id="titleId"
		tabindex="-1"
		autofocus
		class="mb-6 text-2xl font-bold text-grey-950 dark:text-grey-50"
		data-test="modal-dialog-title"
	>
		<slot />
	</component>
</template>

<script setup>
import { inject, useId } from "vue";

defineProps({
	/**
	 * The tag to use for this title.
	 */
	tag: {
		type: String,
		default: "h2",
	},
});

// The id injected from the parent modal-dialog, used to link aria-labelledby on
// the dialog element.
const titleId = inject("modal-dialog-title-id", useId());
</script>
