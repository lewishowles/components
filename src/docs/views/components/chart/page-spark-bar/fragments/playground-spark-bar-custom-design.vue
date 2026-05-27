<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-spark-bar-custom-design"
	>
		<template #title> Custom design </template>

		<spark-bar v-bind="componentProps" v-model="componentModel">
			<template #default="{ percentage }"> {{ percentage }}% </template>
		</spark-bar>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Props both for the template and for the component example itself.
const props = ref({
	current: {
		label: "Current",
		value: 65,
		type: "number",
	},
	"track-classes": {
		label: "Track classes",
		value: "h-2 rounded border border-orange-600 dark:border-orange-300 p-px",
		type: "string",
		isInline: true,
	},
	"bar-classes": {
		label: "Bar classes",
		value: "h-full rounded bg-orange-600 dark:bg-orange-300",
		type: "string",
		isInline: true,
	},
	"value-classes": {
		label: "Value classes",
		value: "text-xs font-semibold text-orange-700 dark:text-orange-300",
		type: "string",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("spark-bar", { props });
</script>
