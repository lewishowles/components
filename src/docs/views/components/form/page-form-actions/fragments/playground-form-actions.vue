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
import { computed } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const buttonTemplate = useTemplateGenerator("ui-button", {
	props: {
		type: {
			value: "submit",
			isInline: true,
		},
		class: {
			value: "button--primary",
			isInline: true,
		},
	},

	slots: {
		default: {
			value: "Create account",
		},
	},

	indent: 1,
});

const linkTemplate = useTemplateGenerator("link-tag", {
	props: {
		href: {
			value: "#",
			isInline: true,
		},
	},

	slots: {
		default: {
			value: "Cancel",
		},
	},

	indent: 2,
});

const slots = computed(() => ({
	"default": {
		value: buttonTemplate.value,
	},
	"tertiary-actions": {
		value: linkTemplate.value,
	},
}));

const template = useTemplateGenerator("form-actions", { slots: slots.value });
</script>
