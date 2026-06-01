<template>
	<div class="prose dark:prose-invert relative max-w-none">
		<pre class="peer whitespace-pre-wrap"><code><slot>{{ textToDisplay }}</slot></code></pre>

		<copy-content
			v-bind="{ content: textToDisplay }"
			class="peer-hocus:pointer-events-auto hocus:pointer-events-auto peer-hocus:opacity-100 hocus:opacity-100 button--muted pointer-events-none absolute end-0 top-0 me-1.5 -translate-y-1/2 text-xs opacity-0 transition-opacity"
		>
			Copy code
		</copy-content>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { getSlotText } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * An alternative way of providing code to display. Content in the `default`
	 * slot will override this content..
	 */
	code: {
		type: String,
		default: null,
	},
});

const slots = useSlots();

// The text from the default slot.
const defaultText = computed(() => getSlotText(slots.default));
// Whether default text has been provided.
const haveDefaultText = computed(() => isNonEmptyString(defaultText.value));
// The text to display, and allow the user to copy.
const textToDisplay = computed(() => (haveDefaultText.value ? defaultText.value : props.code));
</script>
