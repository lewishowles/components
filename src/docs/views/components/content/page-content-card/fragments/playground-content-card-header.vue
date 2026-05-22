<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-content-card-header"
		v-model="slots"
	>
		<template #title> Header content </template>

		<template #introduction> A card with an icon and additional header content. </template>

		<content-card>
			<template #icon>
				<icon-users />
			</template>

			<template #title>
				{{ slots.title.value }}
			</template>

			<template #header-additional>
				<pill-badge>16 users</pill-badge>
			</template>

			{{ slots.default.value }}
		</content-card>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const pillBadgeContent = useTemplateGenerator("pill-badge", {
	slots: {
		default: {
			value: "16 users",
		},
	},
	indent: 1,
});

// Slots both for the template and for the component example itself.
const slots = ref({
	icon: {
		label: "Icon",
		value: "<icon-users />",
	},
	title: {
		label: "Title",
		value: "Recent users",
	},
	"header-additional": {
		label: "Header additional",
		value: pillBadgeContent.value,
	},
	default: {
		label: "Content",
		value: "Four cameras are online and recording.",
		type: "textarea",
	},
});

const template = useTemplateGenerator("content-card", { slots });
</script>
