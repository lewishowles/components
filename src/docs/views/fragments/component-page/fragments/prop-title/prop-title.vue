<template>
	<section-title
		v-bind="{ id }"
		class="group/prop-title relative flex flex-wrap items-baseline gap-4"
	>
		<template #title>
			<slot name="title" />
		</template>

		<template #post-title>
			<dl
				v-if="haveType || haveDefault"
				class="not-prose border-grey-200 flex rounded border text-sm dark:border-transparent dark:bg-white/20"
			>
				<div v-if="haveType" class="flex items-start gap-2 px-2 py-1">
					<dt class="font-bold">Type</dt>
					<dd class="text-grey-500 dark:text-white/60">
						<slot name="type" />
					</dd>
				</div>
				<div
					v-if="haveDefault"
					class="flex shrink-0 items-start gap-2 px-2 py-1"
					:class="{ 'border-grey-200 border-s dark:border-transparent': haveType }"
				>
					<dt class="font-bold">Default</dt>
					<dd class="text-grey-500 font-mono text-balance dark:text-white/60">
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
