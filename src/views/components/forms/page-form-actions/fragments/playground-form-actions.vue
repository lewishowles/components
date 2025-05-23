<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-actions">
		<template #title>
			Form actions
		</template>

		<form-actions>
			<ui-button type="submit" class="button--primary">
				Create account
			</ui-button>

			<template #tertiary-actions>
				<link-tag href="#">
					Cancel
				</link-tag>
			</template>
		</form-actions>
	</component-playground>
</template>

<script setup>
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

const slots = {
	"default": {
		value: useTemplateGenerator("ui-button", {
			props: {
				type: {
					value: "submit",
					inline: true,
				},
				class: {
					value: "button--primary",
					inline: true,
				},
			},

			slots: {
				default: {
					value: "Create account",
				},
			},

			indent: 1,
		}),
	},
	"tertiary-actions": {
		value: "",
	},
};

const template = useTemplateGenerator("form-actions", { slots });
</script>
