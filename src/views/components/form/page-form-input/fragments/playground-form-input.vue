<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-input" v-model="textSlots">
		<template #title>
			Form input
		</template>

		<form-input v-bind="componentProps" v-model="componentModel">
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
		</form-input>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

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

const template = useTemplateGenerator("form-input", { slots: textSlots });
</script>
