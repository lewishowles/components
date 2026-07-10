<template>
	<component-playground v-bind="{ copy: template }" id="playground-confirm-dialog">
		<template #title>Confirm dialog</template>

		<template #introduction>
			<p>
				<code>confirm-dialog</code>
				's title and body content are slots, not props, so it's typically wrapped in a small
				component that supplies its own real markup, then opened via
				<code>openModal</code>
				like any other modal.
			</p>
		</template>

		<ui-button class="button--primary" @click="confirmDeleteAccount">Delete account</ui-button>

		<p v-if="result" class="text-content-muted mt-4 text-sm">{{ result }}</p>

		<template #additional-code>
			<code-block :code="deleteAccountConfirmCode" />
			<code-block :code="openModalCode" />
		</template>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import { useModalDialog } from "@/composables/use-modal-dialog/use-modal-dialog";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

import DeleteAccountConfirm from "./delete-account-confirm.vue";

const { openModal } = useModalDialog();
const template = useTemplateGenerator("confirm-dialog");

// The outcome of the most recent confirmation, for demonstration purposes.
const result = ref("");

function confirmDeleteAccount() {
	result.value = "";

	openModal(DeleteAccountConfirm, {
		onConfirm: () => {
			result.value = "Account deleted.";
		},
		onClose: () => {
			if (!result.value) {
				result.value = "Dialog closed without confirming.";
			}
		},
	});
}

const deleteAccountConfirmCode = [
	"<!-- delete-account-confirm.vue -->",
	"<template>",
	'\t<confirm-dialog danger v-bind="{ onConfirm, onClose }">',
	"\t\t<template #title>Delete your account</template>",
	"",
	"\t\t<p>Are you sure you want to delete your account? This cannot be undone.</p>",
	"",
	"\t\t<template #confirm-button-label>Delete my account</template>",
	"\t</confirm-dialog>",
	"</template>",
	"",
	"<script setup>",
	"\tdefineProps({",
	"\t\t/**",
	"\t\t * Called when the confirm action is chosen.",
	"\t\t */",
	"\t\tonConfirm: {",
	"\t\t\ttype: Function,",
	"\t\t\tdefault: null,",
	"\t\t},",
	"",
	"\t\t/**",
	"\t\t * Called when this dialog closes, for any reason.",
	"\t\t */",
	"\t\tonClose: {",
	"\t\t\ttype: Function,",
	"\t\t\tdefault: null,",
	"\t\t},",
	"\t});",
	// For some reason, excluding the escape here seems to cause a problem with
	// one of the parses, but I'm unsure what's wrong with this template
	// specifically!
	/* eslint-disable-next-line no-useless-escape */
	"<\/script>",
].join("\n");

const openModalCode = [
	'import { useModalDialog } from "@lewishowles/components";',
	'import DeleteAccountConfirm from "./delete-account-confirm.vue";',
	"",
	"const { openModal } = useModalDialog();",
	"",
	"function confirmDeleteAccount() {",
	"\topenModal(DeleteAccountConfirm, {",
	"\t\tonConfirm: () => deleteAccount(),",
	"\t});",
	"}",
].join("\n");
</script>
