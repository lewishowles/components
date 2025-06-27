<template>
	<component-playground v-bind="{ copy: template }" id="playground-donut-chart" v-model="textSlots">
		<template #title>
			Donut chart
		</template>

		<template #introduction>
			The default donut chart.
		</template>

		<donut-chart v-bind="componentProps" />
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({
	values: {
		label: "Values",
		value: [5, 4, 3, 2, 1],
		type: "array",
	},
	class: {
		label: "Class",
		value: "size-50",
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

const template = useTemplateGenerator("donut-chart", { props });
</script>
