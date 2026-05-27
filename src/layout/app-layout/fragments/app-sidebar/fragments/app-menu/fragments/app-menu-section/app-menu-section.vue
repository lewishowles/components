<template>
	<li>
		<span class="text-grey-500 font-semibold dark:text-white/60">
			<slot name="title" />
		</span>

		<div class="from-grey-200 mt-3 mb-2 h-px w-full bg-gradient-to-r dark:from-white/20" />

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
