<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-content-card"
		v-model="textSlots"
	>
		<template #title>Basic card</template>

		<template #introduction>A simple card with a title and content.</template>

		<content-card>
			<content-card-header>
				{{ textSlots.title.value }}
			</content-card-header>

			<content-card-section>
				{{ textSlots.default.value }}
			</content-card-section>
		</content-card>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

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

const headerTemplate = useTemplateGenerator("content-card-header", {
	slots: computed(() => ({ default: textSlots.value.title })),
	indent: 1,
});

const sectionTemplate = useTemplateGenerator("content-card-section", {
	slots: computed(() => ({ default: textSlots.value.default })),
	indent: 1,
});

const template = useTemplateGenerator("content-card", {
	additionalContent: [headerTemplate, sectionTemplate],
});
</script>
