<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>
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
