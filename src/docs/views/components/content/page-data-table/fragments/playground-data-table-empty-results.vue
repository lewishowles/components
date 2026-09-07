<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-data-table-empty-results"
	>
		<template #title>Empty results</template>

		<data-table v-bind="componentProps" v-model="componentModel">
			<template #post-search>
				<form-checkbox v-model="onlyFavourites" class="mb-1.5">Only show favourites</form-checkbox>
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
const onlyFavourites = ref(true);

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
	setup: "const onlyFavourites = ref(true);",
	additionalContent: [
		"\t<template #post-search>",
		'\t\t<form-checkbox v-model="onlyFavourites" class="mb-1.5">',
		"\t\t\tOnly show favourites",
		"\t\t</form-checkbox>",
		"\t</template>",
	].join("\n"),
});
</script>
