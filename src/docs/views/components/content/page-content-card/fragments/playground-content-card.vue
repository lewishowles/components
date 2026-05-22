<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-content-card"
		v-model="textSlots"
	>
		<template #title> Basic card </template>

		<template #introduction> A simple card with a title and content. </template>

		<content-card>
			<template #title>
				{{ textSlots.title.value }}
			</template>

			{{ textSlots.default.value }}
		</content-card>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Text slots both for the template and for the component example itself.
const textSlots = ref({
	title: {
		label: "Title",
		value: "Recent users",
	},
	default: {
		label: "Content",
		value: "These users have been edited recently.",
		type: "textarea",
	},
});

const template = useTemplateGenerator("content-card", { slots: textSlots });
</script>
