<template>
	<li>
		<span class="text-grey-500 dark:text-white/60 font-semibold">
			<slot name="title" />
		</span>

		<div class="h-px w-full bg-gradient-to-r from-grey-200 dark:from-white/20 mt-3 mb-2" />

		<ol>
			<slot />
		</ol>
	</li>
</template>

<script setup>
import { computed, provide, useSlots } from "vue";
import { getSlotText } from "@lewishowles/helpers/vue";

const slots = useSlots();
const titleText = computed(() => getSlotText(slots["title"]));

provide("app-menu-section", {
	sectionTitle: titleText,
});
</script>
