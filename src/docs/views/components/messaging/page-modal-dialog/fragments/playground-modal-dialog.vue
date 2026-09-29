<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-modal-dialog"
		v-model="textSlots"
	>
		<template #title>Modal dialog</template>

		<ui-button class="button--primary" @click="openDialog">Open dialog</ui-button>

		<modal-dialog v-bind="componentProps">
			<template #title>{{ textSlots.title.value }}</template>

			<p>Are you sure you want to delete this user? This cannot be undone.</p>

			<template #actions>
				<ui-button class="button--primary" v-bind="{ reactive: true }">Delete user</ui-button>
			</template>
		</modal-dialog>

		<template #additional-code>
			<code-block :code="buttonCode" />

			<code-block
				code='const deleteUserDialog = useTemplateRef("delete-user-dialog");

function openDialog() {
	callComponentMethod(deleteUserDialog.value, "open");
}'
			/>
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref, useTemplateRef } from "vue";
import { callComponentMethod } from "@lewishowles/helpers/vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({
	ref: {
		value: "delete-user-dialog",
		isInline: true,
	},

	// This playground opens the dialog on demand via the button below, so it
	// shouldn't also open itself immediately on mount.
	initiallyOpen: {
		type: "boolean",
		value: false,
	},
});

// The dialog title, which the playground controls change in both the preview
// and the copied template.
const textSlots = ref({
	title: {
		label: "Dialog title",
		value: 'Delete "Sophie Wardhaugh"',
	},
});

// The code for the dialog's body in the copied template.
const bodyCode = useTemplateGenerator("p", {
	slots: {
		default: { value: "Are you sure you want to delete this user? This cannot be undone." },
	},
});

// The code for the dialog's delete button in the copied template.
const actionsCode = useTemplateGenerator("ui-button", {
	props: { class: { value: "button--primary", isInline: true } },
	slots: { default: { value: "Delete user" } },
	indent: 1,
});

// Every dialog slot for the copied template. The body and actions stay fixed
// because they hold generated markup, which a text control can't update in the
// preview.
const slots = computed(() => ({
	title: textSlots.value.title,
	default: { value: bodyCode },
	actions: { value: actionsCode },
}));

// Our dialog for the demonstration.
const deleteUserDialog = useTemplateRef("delete-user-dialog");

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

// The dialog template that users copy from the playground.
const template = useTemplateGenerator("modal-dialog", { slots, props });

// The code for the button that opens the dialog, shown under the dialog
// template.
const buttonCode = useTemplateGenerator("ui-button", {
	props: { class: { value: "button--primary", isInline: true } },
	slots: { default: { value: "Delete user" } },
	events: { click: { value: "openDialog" } },
});

/**
 * Open our demonstration dialog.
 */
function openDialog() {
	callComponentMethod(deleteUserDialog.value, "open");
}
</script>
