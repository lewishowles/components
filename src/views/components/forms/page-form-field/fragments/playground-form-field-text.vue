<template>
	<component-playground v-bind="{ copy: template }" v-model="textSlots">
		<template #title>
			Text input
		</template>

		<template #introduction>
			<p>When using a text input, it is strongly recommended that a visible label is used, and that the placeholder is not used for meaningful information, as this can cause some users to lose context. Use the label to describe the information required of the user, and help text for any additional explanation that would be useful.</p>
		</template>

		<form-field>
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
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Field label",
		value: "Your name",
	},
	help: {
		label: "Help text",
		value: "We will only use your name to address you in your account and communications, and will not pass it on to third parties.",
		type: "textarea",
	},
	error: {
		label: "Error text",
		value: "",
		type: "textarea",
	},
});

const { template } = useTemplateGenerator("form-field", textSlots);
</script>
