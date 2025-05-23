<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-fieldset" v-model="textSlots">
		<template #title>
			Fieldset
		</template>

		<form-fieldset>
			<template #title>
				{{ textSlots.title?.value }}
			</template>

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>
		</form-fieldset>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	title: {
		label: "Fieldset label",
		value: "Your details",
	},
	introduction: {
		label: "Introduction",
		value: "We use your details to identify your account should you need help.",
		type: "textarea",
	},
});

const template = useTemplateGenerator("form-fieldset", { slots: textSlots });
</script>
