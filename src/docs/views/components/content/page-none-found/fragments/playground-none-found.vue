<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-none-found" v-model="textSlots">
		<template #title>
			None found
		</template>

		<none-found>
			<template #title>
				{{ slots.title?.value }}
			</template>

			{{ slots.default?.value }}

			<template #actions>
				<ui-button class="button--muted">
					Reload users
				</ui-button>
			</template>
		</none-found>
	</component-playground>
</template>

<script setup>
import { computed } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const buttonTemplate = useTemplateGenerator("ui-button", {
	props: {
		class: {
			value: "button--muted",
			isInline: true,
		},
	},

	slots: {
		default: {
			value: "Reload users",
		},
	},

	indent: 1,
});

const slots = computed(() => ({
	title: {
		label: "Title",
		value: "No users found",
	},
	default: {
		label: "Default text",
		value: "No users were added in the last 7 days.",
	},
	actions: {
		value: buttonTemplate.value,
	},
}));

const template = useTemplateGenerator("none-found", { slots: slots.value });
</script>
