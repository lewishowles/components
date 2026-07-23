<template>
	<div class="*:animate-fade-in *:delay flex flex-col gap-4">
		<h1 class="text-content-strong mb-2 text-3xl font-bold">
			<slot name="title" />
		</h1>

		<slot name="introduction" />
	</div>

	<tab-group class="mt-10">
		<slot />
	</tab-group>
</template>

<script setup>
import { computed, useSlots, watchEffect } from "vue";
import { getSlotText } from "@lewishowles/helpers/vue";
import useTitle from "@/docs/composables/use-title/use-title";

const slots = useSlots();
const { setTitle } = useTitle();

// The title of our page. We read this from the slot so that the pages
// themselves don't have to do anything clever, and the page title will update
// automatically.
const titleText = computed(() => getSlotText(slots["title"]));

watchEffect(() => {
	setTitle(titleText.value);
});
</script>
