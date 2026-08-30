<template>
	<div class="relative max-w-none">
		<div ref="codeContainer" class="peer" v-html="codeHtml" />

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
import { computed, nextTick, ref, useSlots, watch } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { getSlotText } from "@lewishowles/helpers/vue";
import {
	normaliseCodeText,
	queueCodeHighlight,
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

// The container MicroLighter scans after Vue has rendered the escaped code.
const codeContainer = ref(null);

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

// Escaped code remains in the DOM while MicroLighter applies CSS highlights.
const codeHtml = computed(() => renderFallbackHtml(textToDisplay.value, props.language));

// Wait for the updated code DOM before scheduling the shared docs-content scan.
watch(
	[textToDisplay, () => props.language],
	() => {
		nextTick(() => {
			queueCodeHighlight(codeContainer.value);
		});
	},
	{ immediate: true },
);
</script>

<style scoped>
:deep(pre) {
	overflow-x: auto;
	white-space: pre;
	border-radius: var(--radius-md);
	background-color: rgb(28 25 23 / 30%);
	backdrop-filter: blur(1rem);
	color: #cad3f5;
	padding: 1rem;
	font-size: var(--text-sm);
	line-height: 1.625;
}

/* Fixed Catppuccin Macchiato colours keep code samples independent of the docs theme. */
:deep(::highlight(comment)),
:deep(::highlight(quote)) {
	color: #939ab7;
}

:deep(::highlight(keyword)),
:deep(::highlight(storage)),
:deep(::highlight(at-rule)),
:deep(::highlight(doctype)),
:deep(::highlight(important)),
:deep(::highlight(section)) {
	color: #c6a0f6;
}

:deep(::highlight(operator)),
:deep(::highlight(punctuation)) {
	color: #91d7e3;
}

:deep(::highlight(string)),
:deep(::highlight(regexp)),
:deep(::highlight(attribute-value)),
:deep(::highlight(link)),
:deep(::highlight(raw)) {
	color: #a6da95;
}

:deep(::highlight(numeric)),
:deep(::highlight(boolean)),
:deep(::highlight(constant)),
:deep(::highlight(symbol)),
:deep(::highlight(character-entity)),
:deep(::highlight(anchor)),
:deep(::highlight(entity)) {
	color: #f5a97f;
}

:deep(::highlight(function)),
:deep(::highlight(decorator)),
:deep(::highlight(animation)) {
	color: #8aadf4;
}

:deep(::highlight(type)),
:deep(::highlight(support)),
:deep(::highlight(tag)),
:deep(::highlight(inserted)) {
	color: #eed49f;
}

:deep(::highlight(variable)),
:deep(::highlight(interpolation)) {
	color: #f0c6c6;
}

:deep(::highlight(property)),
:deep(::highlight(key)),
:deep(::highlight(attribute-name)),
:deep(::highlight(selector)) {
	color: #8bd5ca;
}

:deep(::highlight(deleted)) {
	color: #ed8796;
}
</style>
