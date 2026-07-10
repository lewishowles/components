<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-modal-controller"
		v-model="textSlots"
	>
		<template #title>Modal controller</template>

		<template #introduction>
			<p>Creating a modal for display comes in three parts.</p>

			<h4>The modal content</h4>

			<p>
				Each modal invoked using
				<code>useModalDialog</code>
				is expected to be fully self-contained: it renders its own
				<code>modal-dialog</code>
				, forwards the received
				<code>inert</code>
				prop to it, and calls the received
				<code>onClose</code>
				prop when its dialog closes.
			</p>

			<h4>Displaying the modal</h4>

			<p>
				Displaying the modal involves adding it to the stack via
				<code>openModal</code>
				from
				<code>useModalDialog</code>
				.
			</p>

			<h4>Closing the modal</h4>

			<p>
				The top-most modal can be closed programmatically via the provided
				<code>closeTopModal</code>
				from
				<code>useModalDialog</code>
				.
			</p>
		</template>

		<ui-button class="button--primary" @click="displayModal">Open modal</ui-button>

		<template #additional-code>
			<code-block :code="modalDialogTemplateCode" />
			<code-block :code="useModalDialogCode" />
		</template>
	</component-playground>
</template>

<script setup>
import { useModalDialog } from "@/composables/use-modal-dialog/use-modal-dialog";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

import InceptionModal from "./inception-modal.vue";

const { openModal } = useModalDialog();

function displayModal() {
	openModal(InceptionModal);
}

const template = useTemplateGenerator("modal-controller");

const modalDialogTemplateCode = [
	"<template>",
	'\t<modal-dialog v-bind="{ inert }" @dialog:close="onClose?.()">',
	"\t\t<template #title>",
	'\t\t\tDelete "Sophie Wardhaugh"',
	"\t\t</template>",
	"",
	"\t\t<p>Are you sure you want to delete this user? This cannot be undone.</p>",
	"",
	"\t\t<template #actions>",
	'\t\t\t<ui-button class="button--primary" v-bind="{ reactive: true }" @click="deleteUser">',
	"\t\t\t\tDelete user",
	"\t\t\t</ui-button>",
	"\t\t</template>",
	"\t</modal-dialog>",
	"</template>",
	"",
	"<script setup>",
	"\tconst props = defineProps({",
	"\t\t/**",
	"\t\t * Whether this modal is inert, provided by modal-controller when a modal",
	"\t\t * further up the stack is currently active.",
	"\t\t */",
	"\t\tinert: {",
	"\t\t\ttype: Boolean,",
	"\t\t\tdefault: false,",
	"\t\t},",
	"",
	"\t\t/**",
	"\t\t * Called when this modal should close, provided by modal-controller.",
	"\t\t */",
	"\t\tonClose: {",
	"\t\t\ttype: Function,",
	"\t\t\tdefault: null,",
	"\t\t},",
	"\t});",
	"\t// ...",
	// For some reason, excluding the escape here seems to cause a problem with
	// one of the parses, but I'm unsure what's wrong with this template
	// specifically!
	/* eslint-disable-next-line no-useless-escape */
	"<\/script>",
].join("\n");

const useModalDialogCode = [
	'import { useModalDialog } from "@lewishowles/components";',
	'import DeleteUserDialog from "./dialogs/delete-user-dialog";',
	"const { closeTopModal, openModal } = useModalDialog();",
	"// ...",
	"const componentProps = { ... };",
	"openModal(DeleteUserDialog, componentProps);",
].join("\n\n");
</script>
