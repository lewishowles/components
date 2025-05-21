<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-fieldset" v-model="textSlots">
		<template #title>
			Fieldset
		</template>

		<template #introduction>
			A standard fieldset containing a title and introduction, ready to receive fields.
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
		label: "Field label",
		value: "Your name",
	},
	introduction: {
		label: "Introduction",
		value: "We will only use your name to address you in your account and communications, and will not pass it on to third parties.",
		type: "textarea",
	},
});

const { template } = useTemplateGenerator("form-field", textSlots);
</script>
