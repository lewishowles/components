<template>
	<div class="prose dark:prose-invert relative max-w-none">
		<div class="peer" v-html="codeHtml" />

		<copy-content
			v-bind="{ content: textToDisplay }"
			class="peer-hocus:pointer-events-auto hocus:pointer-events-auto peer-hocus:opacity-100 hocus:opacity-100 button--muted pointer-events-none absolute end-0 top-0 me-1.5 -translate-y-1/2 text-xs opacity-0 transition-opacity"
		>
			Copy code
		</copy-content>
	</div>
</template>

<script setup>
import { computed, ref, useSlots, watch } from "vue";
import { getSlotText } from "@lewishowles/helpers/vue";
import { normaliseCodeText, renderCodeHtml } from "@/docs/helpers/code-highlighter.js";

const props = defineProps({
	/**
	 * An alternative way of providing code to display. Content in the `default`
	 * slot will override this content.
	 */
	code: {
		type: String,
		default: null,
	},
	/**
	 * The language of the code sample.
	 */
	language: {
		type: String,
		default: null,
	},
});

const slots = useSlots();
const codeHtml = ref("");

// The text from the default slot.
const defaultText = computed(() => getSlotText(slots.default));
// Whether default text has been provided.
const haveDefaultText = computed(() => defaultText.value.trim().length > 0);

// The text to display, and allow the user to copy.
const textToDisplay = computed(() =>
	normaliseCodeText(haveDefaultText.value ? defaultText.value : props.code),
);

let highlightRequestId = 0;

// Re-render when the displayed code or language changes.
watch(
	[textToDisplay, () => props.language],
	async ([code, language]) => {
		const requestId = (highlightRequestId += 1);
		const html = await renderCodeHtml(code, language);

		if (requestId !== highlightRequestId) {
			return;
		}

		codeHtml.value = html;
	},
	{ immediate: true },
);
</script>

<style scoped>
:deep(.shiki) {
	margin-block-end: 0;
	overflow-x: auto;
	white-space: pre-wrap;
	border-radius: var(--radius-md);
	padding: 1rem;
	font-size: var(--text-sm);
	line-height: 1.625;
}
</style>
