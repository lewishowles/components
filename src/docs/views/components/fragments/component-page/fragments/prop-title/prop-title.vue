<template>
	<section-title v-bind="{ id }" class="flex flex-wrap gap-4 items-baseline relative group/prop-title">
		<template #title>
			<slot name="title" />
		</template>

		<template #post-title>
			<dl v-if="haveType || haveDefault" class="flex not-prose text-sm border border-grey-200 rounded dark:border-transparent dark:bg-white/20">
				<div v-if="haveType" class="flex flex-wrap items-center gap-2 px-2 py-1 items-start">
					<dt class="font-bold">
						Type
					</dt>
					<dd class="text-grey-500 dark:text-white/60">
						<slot name="type" />
					</dd>
				</div>
				<div v-if="haveDefault" class="flex flex-wrap items-center gap-2 px-2 py-1 items-start" :class="{ 'border-s border-grey-200 dark:border-transparent': haveType }">
					<dt class="font-bold">
						Default
					</dt>
					<dd class="text-grey-500 dark:text-white/60 font-mono text-balance">
						<slot name="default-value" />
					</dd>
				</div>
			</dl>
		</template>
	</section-title>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

import SectionTitle from "../section-title/section-title.vue";

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
const haveDefault = computed(() => isNonEmptySlot(slots["default-value"]));
</script>
