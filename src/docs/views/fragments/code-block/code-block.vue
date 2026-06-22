<template>
	<div class="prose dark:prose-invert relative max-w-none">
		<pre
			class="peer mb-0 overflow-x-auto rounded-md bg-neutral-950 p-4 text-sm leading-relaxed whitespace-pre-wrap text-neutral-100"
		><code v-bind="{ class: languageClass }">{{ textToDisplay }}</code></pre>

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

// The text from the default slot.
const defaultText = computed(() => getSlotText(slots.default));
// Whether default text has been provided.
const haveDefaultText = computed(() => isNonEmptyString(defaultText.value));

// The text to display, and allow the user to copy.
const textToDisplay = computed(() =>
	normaliseCodeText(haveDefaultText.value ? defaultText.value : props.code),
);

// The language to expose on the code element.
const resolvedLanguage = computed(() => resolveLanguage(textToDisplay.value, props.language));
// The language class exposed for user-agent tooling and future styling.
const languageClass = computed(() => `language-${resolvedLanguage.value}`);

/**
 * Remove template indentation from code samples without changing internal
 * formatting.
 *
 * @param  {string|null}  code
 *     The code sample to normalise.
 * @returns {string}
 */
function normaliseCodeText(code) {
	if (!isNonEmptyString(code)) {
		return "";
	}

	const lines = code.replace(/\r\n/g, "\n").split("\n");

	while (lines[0]?.trim() === "") {
		lines.shift();
	}

	while (lines.at(-1)?.trim() === "") {
		lines.pop();
	}

	const indentation = lines
		.filter((line) => line.trim() !== "")
		.map((line) => line.match(/^\s*/)[0].length)
		.reduce((minimum, length) => Math.min(minimum, length), Infinity);

	if (!Number.isFinite(indentation) || indentation === 0) {
		return lines.join("\n");
	}

	return lines.map((line) => line.slice(indentation)).join("\n");
}

/**
 * Resolve the code language from an explicit prop or a small set of common
 * examples.
 *
 * @param  {string}  code
 *     The code sample to inspect.
 * @param  {string|null}  language
 *     The explicitly provided language.
 * @returns {string}
 */
function resolveLanguage(code, language) {
	if (isNonEmptyString(language)) {
		return language.toLowerCase();
	}

	const trimmedCode = code.trim();

	if (trimmedCode.startsWith("<")) {
		return "html";
	}

	if (/^(const|let|var|function|import|export|\[|\{)/.test(trimmedCode)) {
		return "javascript";
	}

	return "text";
}
</script>
