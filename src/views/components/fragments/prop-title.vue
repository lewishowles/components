<template>
	<div v-bind="{ id }" class="flex gap-4 items-baseline relative group/prop-title">
		<a v-bind="{ href: `#${id}` }" class="opacity-0 absolute top-8.5 end-full pe-3 block group-hover/prop-title:opacity-100 transition-opacity">
			# <span class="sr-only">Link to this section</span>
		</a>

		<h3>
			<slot name="title" />
		</h3>

		<dl v-if="haveType || haveDefault" class="flex gap-4 not-prose text-sm">
			<div v-if="haveType" class="rounded-full bg-grey-100 dark:bg-grey-950/20 flex items-center gap-2 px-3 py-1">
				<dt class="font-bold">
					Type
				</dt>
				<dd class="text-grey-500 dark:text-white/60">
					<slot name="type" />
				</dd>
			</div>
			<div v-if="haveDefault" class="rounded-full bg-grey-100 dark:bg-grey-950/20 flex items-center gap-2 px-3 py-1">
				<dt class="font-bold">
					Default
				</dt>
				<dd class="text-grey-500 dark:text-white/60 font-mono">
					<slot name="default" />
				</dd>
			</div>
		</dl>

		<a href="#content" class="text-sm opacity-0 group-hover/prop-title:opacity-100 transition-opacity">&uarr; Top</a>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

defineProps({
	/**
	 * The ID of this section, allow it to be linked to.
	 */
	id: {
		type: String,
		default: null,
	},
});

const slots = useSlots();
// Whether a "type" slot has been provided.
const haveType = computed(() => isNonEmptySlot(slots.type));
// Whether a "default" slot has been provided.
const haveDefault = computed(() => isNonEmptySlot(slots.default));
</script>
