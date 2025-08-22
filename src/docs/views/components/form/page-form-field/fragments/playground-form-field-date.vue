<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-field-date" v-model="textSlots">
		<template #title>
			Date
		</template>

		<template #introduction>
			<p>Allow the user to enter a date. The date input comprises three different inputs, which helps to avoid any confusion, and makes parsing the date simpler.</p>
		</template>

		<form-field v-model="componentModel" v-bind="componentProps">
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
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Field label",
		value: "When did you first apply?",
	},
	introduction: {
		label: "Introduction",
		value: "Please enter the date you applied, regardless of when your application was processed.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "If you don't know the exact date, please get as close as you can.",
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

const template = useTemplateGenerator("form-field", { slots: textSlots, props });
</script>
