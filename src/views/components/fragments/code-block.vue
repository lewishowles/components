<template>
	<div class="relative">
		<pre class="peer"><code><slot /></code></pre>

		<copy-content v-bind="{ content: defaultText }" class="opacity-0 transition-opacity pointer-events-none peer-hocus:pointer-events-auto hocus:pointer-events-auto peer-hocus:opacity-100 hocus:opacity-100 button--muted text-xs absolute end-0 me-1.5 top-0 -translate-y-1/2">
			Copy example
		</copy-content>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { getSlotText } from "@lewishowles/helpers/vue";

const slots = useSlots();

// The text from the default slot.
const defaultText = computed(() => getSlotText(slots.default));
</script>
