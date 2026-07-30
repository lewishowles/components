<template>
	<div class="relative max-w-none">
		<div class="peer" v-html="codeHtml" />

		<div
			v-if="haveFileName"
			class="border-border text-muted rounded-b-md border border-t-0 px-4 py-2 font-mono text-xs"
		>
			{{ file }}
		</div>

		<copy-content
			v-bind="{ content: textToDisplay }"
			class="peer-hocus:pointer-events-auto hocus:pointer-events-auto peer-hocus:opacity-100 hocus:opacity-100 button--muted pointer-events-none absolute inset-e-0 top-0 me-1.5 -translate-y-1/2 text-xs opacity-0 transition-opacity"
		>
			Copy code
		</copy-content>
	</div>
</template>

<script setup>
import { computed, ref, useSlots, watch } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { getSlotText } from "@lewishowles/helpers/vue";
import {
	normaliseCodeText,
	renderCodeHtml,
	renderFallbackHtml,
} from "@/docs/helpers/code-highlighter.js";

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
	 * The source filename displayed with the code sample.
	 */
	file: {
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

// The text from the default slot.
const defaultText = computed(() => getSlotText(slots.default));
// Whether default text has been provided.
const haveDefaultText = computed(() => defaultText.value.trim().length > 0);
// Whether a source filename has been provided.
const haveFileName = computed(() => isNonEmptyString(props.file));

// The text to display, and allow the user to copy.
const textToDisplay = computed(() =>
	normaliseCodeText(haveDefaultText.value ? defaultText.value : props.code),
);

// Show unhighlighted code immediately so the block is never empty while
// Shiki loads off the critical path.
const codeHtml = ref(renderFallbackHtml(textToDisplay.value, props.language));

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
	overflow-x: auto;
	white-space: pre;
	border-radius: var(--radius-md);
	padding: 1rem;
	font-size: var(--text-sm);
	line-height: 1.625;
}
</style>
