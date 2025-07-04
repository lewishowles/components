<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-progress-bar" v-model="textSlots">
		<template #title>
			Showing labels
		</template>

		<progress-bar v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}
		</progress-bar>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Default",
		value: "Orange tanker levels",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	"value": {
		label: "Value",
		value: 45,
		type: "number",
	},
	"showLabel": {
		label: "Show label",
		value: true,
		type: "boolean",
	},
	"showValue": {
		label: "Show value",
		value: true,
		type: "boolean",
	},
	"track-classes": {
		label: "Track classes",
		value: "h-4 p-1 rounded-full border border-orange-600 dark:border-orange-300",
		type: "string",
		inline: true,
	},
	"bar-classes": {
		label: "Bar classes",
		value: "h-full rounded-full bg-orange-600 dark:bg-orange-300",
		type: "string",
		inline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("progress-bar", { slots: textSlots, props });
</script>
