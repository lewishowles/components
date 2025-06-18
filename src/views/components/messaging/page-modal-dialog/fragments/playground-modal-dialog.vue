<template>
	<component-playground v-bind="{ copy: template }" id="playground-modal-dialog" v-model="textSlots">
		<template #title>
			Modal dialog
		</template>

		<ui-button class="button--primary" @click="openDialog">
			Open dialog
		</ui-button>

		<modal-dialog v-bind="componentProps" v-model="componentModel">
			<template #title>
				Delete "Sophie Wardhaugh"
			</template>

			<p>Are you sure you want to delete this user? This cannot be undone.</p>

			<template #actions>
				<ui-button class="button--primary" v-bind="{ reactive: true }">
					Delete user
				</ui-button>
			</template>
		</modal-dialog>

		<template #additional-code>
			<code-block :code="useTemplateGenerator('ui-button', { props: { class: { value: 'button--primary', inline: true } }, slots: { default: { value: 'Delete user' } }, events: { click: { value: 'openDialog' } } })" />

			<code-block code="const deleteUserDialog = useTemplateRef(&quot;delete-user-dialog&quot;);" />

			<code-block
				code="function openDialog() {
	runComponentMethod(deleteUserDialog.value, &quot;open&quot;);
}"
			/>
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref, useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({
	ref: {
		value: "delete-user-dialog",
		inline: true,
	},
});

const slots = {
	title: {
		value: "Delete \"Sophie Wardhaugh\"",
	},
	default: {
		value: useTemplateGenerator("p", { slots: { default: { value: "Are you sure you want to delete this user? This cannot be undone." } } }),
	},
	actions: {
		value: useTemplateGenerator("ui-button", { props: { class: { value: "button--primary", inline: true } }, slots: { default: { value: "Delete user" } }, indent: 1 }),
	},
};

// Our dialog for the demonstration.
const deleteUserDialog = useTemplateRef("delete-user-dialog");

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("modal-dialog", { slots, props });

/**
 * Open our demonstration dialog.
 */
function openDialog() {
	runComponentMethod(deleteUserDialog.value, "open");
}
</script>
