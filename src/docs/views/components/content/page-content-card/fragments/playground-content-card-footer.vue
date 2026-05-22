<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-content-card-footer"
		v-model="textSlots"
	>
		<template #title> Footer variants </template>

		<template #introduction>
			A card footer can use the default well treatment or a plain treatment.
		</template>

		<content-card footer-variant="well">
			<template #title>
				{{ textSlots.title.value }}
			</template>

			{{ textSlots.default.value }}

			<template #footer>
				{{ textSlots.footer.value }}
			</template>
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
		value: "Connection health",
	},
	default: {
		label: "Content",
		value: "All sensors reported within the last minute.",
		type: "textarea",
	},
	footer: {
		label: "Footer",
		value: "Last checked just now",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	footerVariant: {
		label: "Footer variant",
		value: "well",
		type: "text",
	},
});

const template = useTemplateGenerator("content-card", { props, slots: textSlots });
</script>
