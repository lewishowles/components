<template>
	<section-title
		v-bind="{ id }"
		class="group/prop-title relative mt-4 flex flex-wrap items-baseline gap-4"
	>
		<template #title>
			<slot name="title" />
		</template>

		<template #post-title>
			<dl v-if="haveType || haveDefault" class="border-border flex rounded border text-sm">
				<div v-if="haveType" class="flex items-start gap-2 px-2 py-1">
					<dt class="font-bold">Type</dt>
					<dd class="text-content-muted">
						<slot name="type" />
					</dd>
				</div>
				<div
					v-if="haveDefault"
					class="flex shrink-0 items-start gap-2 px-2 py-1"
					:class="{ 'border-border border-s': haveType }"
				>
					<dt class="font-bold">Default</dt>
					<dd class="text-muted font-mono text-balance">
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
