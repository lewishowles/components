<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-modal-controller" v-model="textSlots">
		<template #title>
			Modal controller
		</template>

		<template #introduction>
			<p>Creating a modal for display comes in two parts.</p>

			<h3>The modal itself</h3>

			<p>Create a modal dialog as its own component. This can be created as you choose, but using <code>modal-dialog</code> is a good starting point.</p>

			<h3>Displaying the modal</h3>

			<p>Displaying the modal involves adding it to the stack via <code>useModalDialog</code>.</p>

			<p>Examples of both of these can be found in the playground code.</p>
		</template>

		<ui-button class="button--primary" @click="displayModal">
			Open modal
		</ui-button>

		<template #additional-code>
			<code-block :code="modalDialogTemplateCode" />
			<code-block :code="useModalDialogCode" />
		</template>
	</component-playground>
</template>

<script setup>
import useModalDialog from "@/composables/use-modal-dialog/use-modal-dialog";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

import InceptionModal from "./inception-modal.vue";

const { openModal } = useModalDialog();

function displayModal() {
	openModal(InceptionModal);
}

const template = useTemplateGenerator("modal-controller");

const modalDialogTemplateCode = [
	"<template>",
	"\t<modal-dialog>",
	"\t\t<template #title>",
	"\t\t\tDelete \"Sophie Wardhaugh\"",
	"\t\t</template>",
	"",
	"\t\t<p>Are you sure you want to delete this user? This cannot be undone.</p>",
	"",
	"\t\t<template #actions>",
	"\t\t\t<ui-button class=\"button--primary\" v-bind=\"{ reactive: true }\" @click=\"deleteUser\">",
	"\t\t\t\tDelete user",
	"\t\t\t</ui-button>",
	"\t\t</template>",
	"\t</modal-dialog>",
	"</template>",
	"",
	"<script setup>",
	"\t// ...",
	"<\/script>",
].join("\n");

const useModalDialogCode = [
	"import { useModalDialog } from \"@lewishowles/components\";",
	"import DeleteUserDialog from \"./dialogs/delete-user-dialog\";",
	"const { openModal } = useModalDialog();",
	"// ...",
	"const componentProps = { ... };",
	"openModal(DeleteUserDialog, componentProps);",
].join("\n\n");
</script>
