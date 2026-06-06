<template>
	<ui-button
		:class="cn('relative', attributes.class)"
		v-bind="attributesWithoutClass"
		data-component="copy-content"
		:data-copied="showCopySuccess || null"
		data-test="copy-content"
		@click="copyContent"
	>
		<span
			class="flex items-center gap-2 transition-opacity"
			:class="{ 'opacity-0': showCopySuccess || showCopyError }"
			data-part="label"
			data-test="copy-content-label"
		>
			<icon-clipboard />

			<slot>Copy</slot>
		</span>

		<span
			v-if="showCopySuccess"
			class="animate-fade-in absolute inset-0 flex items-center justify-center gap-1"
			data-part="success"
			data-test="copy-content-success"
		>
			<icon-check-circled />

			<slot name="copy-success-label">Copied</slot>
		</span>

		<span
			v-if="showCopyError"
			class="animate-fade-in absolute inset-0 flex items-center justify-center gap-1"
			data-part="error"
			data-test="copy-content-error"
		>
			<icon-danger />

			<slot name="copy-error-label">Error</slot>
		</span>
	</ui-button>

	<span role="status" aria-live="polite" class="sr-only" data-test="copy-content-status">
		{{ statusMessage }}
	</span>
</template>

<script setup>
import { cn } from "@/utilities/cn.js";
import { getSlotText } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { computed, ref, useAttrs, useSlots } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
	/**
	 * The content to copy when the button is activated.
	 */
	content: {
		type: String,
		required: true,
	},
});

const attributes = useAttrs();
const slots = useSlots();

// All attributes except class, spread onto the root button separately so that
// class can be handled via cn() without doubling up.
const attributesWithoutClass = computed(() => {
	const { class: _omitted, ...rest } = attributes;

	return rest;
});

// Whether to show the copy success message.
const showCopySuccess = ref(false);
// Whether to show the copy error message.
const showCopyError = ref(false);
// The current live region announcement.
const statusMessage = ref("");
// The text to announce to screen readers on copy success.
const successLabel = computed(() => getSlotText(slots["copy-success-label"]) || "Copied");
// The text to announce to screen readers on copy error.
const errorLabel = computed(() => getSlotText(slots["copy-error-label"]) || "Error");

/**
 * Copy the provided content to the clipboard. Note that this only works in
 * secure contexts.
 */
async function copyContent() {
	if (!isNonEmptyString(props.content)) {
		displayCopyError();

		console.error("copy-content[copyContent]: No content to copy");

		return;
	}

	try {
		await navigator.clipboard.writeText(props.content);

		displayCopySuccess();
	} catch (error) {
		console.error("copy-content[copyContent]: Failed to copy content", error);

		displayCopyError();
	}
}

/**
 * Briefly display the copy success label.
 */
function displayCopySuccess() {
	displayMessage(showCopySuccess);
	announceStatus(successLabel.value);
}

/**
 * Briefly display the copy error label.
 */
function displayCopyError() {
	displayMessage(showCopyError);
	announceStatus(errorLabel.value);
}

/**
 * Briefly toggle the display of a message based on the provided variable.
 *
 * @param  {ref}  variable
 *     The variable to toggle.
 */
function displayMessage(variable) {
	variable.value = true;

	setTimeout(() => {
		variable.value = false;
	}, 2000);
}

/**
 * Announce a status message to screen reader users via the live region. Uses
 * a clear-then-set pattern so repeated actions always trigger a fresh
 * announcement.
 *
 * @param  {string}  message
 *     The text to announce.
 */
function announceStatus(message) {
	statusMessage.value = "";

	setTimeout(() => {
		statusMessage.value = message;
	}, 100);
}
</script>
