<template>
	<component-playground v-bind="{ copy: template }" v-model="textSlots">
		<template #title>
			Textarea
		</template>

		<template #introduction>
			<p>As with a text input, when using a textarea, it is strongly recommended that a visible label is used, and that the placeholder is not used for meaningful information, as this can cause some users to lose context. Use the label to describe the information required of the user, and help text for any additional explanation that would be useful.</p>
		</template>

		<form-field type="textarea">
			{{ textSlots.label.value }}

			<template #help>
				{{ textSlots.help.value }}
			</template>

			<template #error>
				{{ textSlots.error.value }}
			</template>
		</form-field>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Field label",
		value: "About you",
	},
	help: {
		label: "Help text",
		value: "This will be displayed on your profile and will be public to other users of the website.",
		type: "textarea",
	},
	error: {
		label: "Error text",
		value: "",
		type: "textarea",
	},
});

const componentProps = {
	type: {
		label: "Type",
		value: "textarea",
		type: "text",
	},
};

const { template } = useTemplateGenerator("form-field", textSlots.value, componentProps);
</script>
