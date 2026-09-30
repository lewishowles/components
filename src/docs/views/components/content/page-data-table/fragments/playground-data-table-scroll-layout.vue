<template>
	<component-playground v-bind="{ copy: template }" id="playground-data-table-scroll-layout">
		<template #title>Comparison table</template>

		<div class="max-w-80">
			<data-table v-bind="componentProps" />
		</div>

		<template #additional-code>
			<code-block :code="`const columns = ${JSON.stringify(columns, null, '\t')};`" />
			<code-block :code="`const data = ${JSON.stringify(data, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Two products with values that are easiest to compare across columns.
const data = [
	{ product: "Studio plan", storage: "1 TB", monthlyPrice: "£24" },
	{ product: "Team plan", storage: "2 TB", monthlyPrice: "£39" },
];

// The visible comparison columns.
const columns = {
	product: { label: "Product" },
	storage: { label: "Storage" },
	monthlyPrice: { label: "Monthly price" },
};

// Props used by both the example and its copyable code.
const props = ref({
	data: { label: "Data", value: data, type: "array" },
	columns: { label: "Column configuration", value: columns, type: "object" },
	narrowLayout: { label: "Narrow layout", value: "scroll", type: "string" },
	overflowLabel: {
		label: "Overflow label",
		value: "Product comparison",
		type: "string",
	},
});

// Pass the configured example props to the table.
const componentProps = computed(() =>
	Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value])),
);

// The Vue example shown in the copy panel.
const template = useTemplateGenerator("data-table", { props });
</script>
