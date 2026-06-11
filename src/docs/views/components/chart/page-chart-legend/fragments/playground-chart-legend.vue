<template>
	<component-playground v-bind="{ copy: template }" id="playground-chart-legend">
		<template #title>Chart legend</template>

		<template #introduction>
			A legend showing labels and values alongside their chart colours.
		</template>

		<chart-legend v-bind="componentProps" />
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import { useChartConfig } from "@/composables/use-chart-config/use-chart-config";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const rawSegments = [
	{ label: "Revenue", value: 42 },
	{ label: "Costs", value: 18 },
	{ label: "Profit", value: 24 },
];

const { series } = useChartConfig(rawSegments);

// Props both for the template and for the component example itself.
const props = ref({
	series: {
		label: "Series",
		value: series.value,
		type: "array",
	},
	showValues: {
		label: "Show values",
		value: true,
		type: "boolean",
	},
	orientation: {
		label: "Orientation",
		value: "horizontal",
		type: "string",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("chart-legend", { props });
</script>
