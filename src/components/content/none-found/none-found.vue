<template>
	<div class="flex flex-col gap-1" data-component="none-found" data-test="none-found">
		<component
			:is="headingLevel"
			:class="cn('text-grey-950 text-2xl font-bold', titleClasses)"
			data-test="none-found-title"
		>
			<slot name="title" />
		</component>

		<slot />

		<div v-if="haveActions" class="mt-7 flex gap-4" data-test="none-found-actions">
			<slot name="actions" />
		</div>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { cn } from "@/utilities/cn.js";

defineProps({
	/**
	 * The heading level to use for the title.
	 */
	headingLevel: {
		type: String,
		default: "h2",
	},

	/**
	 * Additional classes to apply to the title, merged on top of the title's
	 * base styles. Any provided classes that conflict with base classes will override as necessary.
	 */
	titleClasses: {
		type: [String, Array, Object],
		default: null,
	},
});

const slots = useSlots();
// Whether any actions have been provided by the user.
const haveActions = computed(() => isNonEmptySlot(slots.actions));
</script>
