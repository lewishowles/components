<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-content-card-footer"
		v-model="textSlots"
	>
		<template #title>Card with footer</template>

		<template #introduction>
			Pass
			<code>footerClasses</code>
			to style the footer. The base structural styles (border, rounding, flex, padding) are always
			applied; any classes you provide will be merged on top.
		</template>

		<content-card v-bind="{ footerClasses: props.footerClasses.value || null }">
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
	footerClasses: {
		label: "Footer classes",
		value: "bg-grey-50",
		type: "text",
	},
});

const template = useTemplateGenerator("content-card", { props, slots: textSlots });
</script>
