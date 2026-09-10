<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-data-table-empty-results"
	>
		<template #title>Empty results</template>

		<data-table v-bind="componentProps" v-model="componentModel">
			<template #post-search>
				<form-button-group
					v-model="resultFilter"
					name="result-filter"
					:options="['All', 'Favourites', 'Recent']"
				>
					Filter results
				</form-button-group>
			</template>
		</data-table>

		<template #additional-code>
			<code-block :code="`const columns = ${JSON.stringify(columns, null, '\t')};`" />
			<code-block :code="`const data = ${JSON.stringify(data, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);
// A custom filter that remains available when there are no matching rows.
const resultFilter = ref("Favourites");

// An empty result set keeps the toolbar and column controls available.
const data = [];

// Columns remain configurable even without rows to display.
const columns = {
	title: { label: "Title" },
	year: { label: "Year of release" },
};

// Props both for the template and for the component example itself.
const props = ref({
	data: { label: "Data", value: data, type: "array" },
	columns: { label: "Column configuration", value: columns, type: "object" },
	name: {
		label: "Table name",
		value: "playground-data-table-empty-results",
		type: "string",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

// Include the custom filter and its initial value in the copied example.
const template = useTemplateGenerator("data-table", {
	props,
	setup: 'const resultFilter = ref("Favourites");',
	additionalContent: [
		"\t<template #post-search>",
		"\t\t<form-button-group",
		'\t\t\tv-model="resultFilter"',
		'\t\t\tname="result-filter"',
		"\t\t\t:options=\"['All', 'Favourites', 'Recent']\"",
		"\t\t>",
		"\t\t\tFilter results",
		"\t\t</form-button-group>",
		"\t</template>",
	].join("\n"),
});
</script>
