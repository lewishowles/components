<template>
	<component-playground v-bind="{ copy: template }" id="playground-donut-chart" v-model="textSlots">
		<template #title>
			Colourful chart
		</template>

		<template #introduction>
			A more colourful donut chart. Use with caution, as depending on the number of slices, adjacent slices may not be sufficiently distinct.
		</template>

		<donut-chart v-bind="componentProps" />
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({
	values: {
		label: "Values",
		value: [5, 4, 3, 2],
		type: "array",
	},
	colourful: {
		label: "Colourful",
		value: true,
		type: "boolean",
	},
	class: {
		label: "Class",
		value: "size-50",
		type: "string",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("donut-chart", { props });
</script>
