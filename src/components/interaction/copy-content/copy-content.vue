<template>
	<ui-button :class="{ 'relative': !$attrs.class?.includes('absolute') }" data-test="copy-content" @click="copyContent">
		<span class="transition-opacity" :class="{ 'opacity-0': showCopySuccess || showCopyError }" data-test="copy-content-label">
			<icon-copy />

			<slot>
				Copy
			</slot>
		</span>

		<span v-if="showCopySuccess" class="absolute inset-0 flex gap-1 items-center justify-center animate-fade-in" data-test="copy-content-success">
			<icon-check-circled />

			<slot name="copy-success-label">
				Copied
			</slot>
		</span>

		<span v-if="showCopyError" class="absolute inset-0 flex gap-1 items-center justify-center animate-fade-in" data-test="copy-content-error">
			<icon-danger />

			<slot name="copy-error-label">
				Error
			</slot>
		</span>
	</ui-button>
</template>

<script setup>
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { ref } from "vue";

const props = defineProps({
	/**
	 * The content to copy when the button is activated.
	 */
	content: {
		type: String,
		required: true,
	},
});

// Whether to show the copy success message.
const showCopySuccess = ref(false);
// Whether to show the copy error message.
const showCopyError = ref(false);

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
}

/**
 * Briefly display the copy error label.
 */
function displayCopyError() {
	displayMessage(showCopyError);
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
</script>
