<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-textarea" v-model="textSlots">
		<template #title>
			Form textarea
		</template>

		<form-textarea>
			{{ textSlots.default?.value }}

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>

			<template #help>
				{{ textSlots.help?.value }}
			</template>

			<template #error>
				{{ textSlots.error?.value }}
			</template>
		</form-textarea>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Field label",
		value: "About you",
	},
	introduction: {
		label: "Introduction",
		value: "This will be displayed on your profile and will be visible to other users of the website.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "You can use basic Markdown such as **bold** and _italic_.",
		type: "textarea",
	},
	error: {
		label: "Error text",
		value: "",
		type: "textarea",
	},
});

const template = useTemplateGenerator("form-textarea", { slots: textSlots });
</script>
