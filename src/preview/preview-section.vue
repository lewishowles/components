<template>
	<div>
		<h2 class="relative mb-4 inline-block py-1 text-lg font-bold text-grey-950 dark:text-grey-50">
			<div class="absolute inset-y-0 end-full me-4 w-1 rounded-sm bg-[#be185d]" />
			<slot name="title" />

			<small v-if="haveSubtitle" class="block font-normal text-grey-500 dark:text-white/60">
				<slot name="subtitle" />
			</small>
		</h2>

		<div class="flex flex-col gap-14">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const slots = useSlots();
// Whether a subtitle has been provided
const haveSubtitle = computed(() => isNonEmptySlot(slots.subtitle));
</script>
