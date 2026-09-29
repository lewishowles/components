<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-modal-controller"
		v-model="textSlots"
	>
		<template #title>Modal controller</template>

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
	'\t<modal-dialog @dialog:close="onClose?.()">',
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
	"\tdefineProps({",
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
