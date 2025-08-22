<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-field-text" v-model="textSlots">
		<template #title>
			Text input
		</template>

		<template #introduction>
			<p>A basic text input, allowing a user to enter short strings of text. When using a text input, it is strongly recommended that a visible label is used, and that the placeholder is not used for meaningful information, as this can cause some users to lose context. Use the label to describe the information required of the user, and help text for any additional explanation that would be useful.</p>
		</template>

		<form-field v-model="componentModel">
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
		</form-field>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Field label",
		value: "Your name",
	},
	introduction: {
		label: "Introduction",
		value: "We will only use your name to address you in your account and communications, and will not pass it on to third parties.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "Please use the name you wish to be addressed by, even if this is different to your legal name.",
		type: "textarea",
	},
	error: {
		label: "Error text",
		value: "",
		type: "textarea",
	},
});

const template = useTemplateGenerator("form-field", { slots: textSlots });
</script>
