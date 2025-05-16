<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-field-text" v-model="textSlots">
		<template #title>
			Date
		</template>

		<template #introduction>
			<p>Allow the user to enter a date. The date input comprises three different inputs to avoid any confusion.</p>
		</template>

		<form-field v-bind="componentProps">
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
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Field label",
		value: "When did you first apply?",
	},
	help: {
		label: "Help text",
		value: "Please enter the date you applied. If you don't know the exact date, please get as close as you can.",
		type: "textarea",
	},
	error: {
		label: "Error text",
		value: "",
		type: "textarea",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	type: {
		label: "Type",
		value: "date",
		type: "text",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const { template } = useTemplateGenerator("form-field", textSlots, props);
</script>
