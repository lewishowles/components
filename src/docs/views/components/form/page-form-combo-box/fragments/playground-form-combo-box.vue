<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-combo-box"
		v-model="textSlots"
	>
		<template #title>Record lookup</template>

		<template #introduction>
			<p>
				Type a record name to filter the list. Both Quarterly review entries have the same label,
				but selecting either one stores its distinct record ID.
			</p>
		</template>

		<form-combo-box v-bind="componentProps" v-model="componentModel">
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

			<template #option="{ option, highlighted, selected }">
				<div
					:class="{ 'font-semibold': highlighted }"
					class="flex items-center justify-between gap-4"
				>
					<div class="flex flex-col">
						<span>{{ option.name }}</span>
						<span class="text-content-muted text-xs">Updated: {{ option.updated }}</span>
					</div>

					<span v-if="selected" aria-hidden="true" class="text-content-muted text-xs">
						Selected
					</span>
				</div>
			</template>
		</form-combo-box>

		<p v-if="componentModel" class="mt-4 text-sm" data-test="playground-form-combo-box-selection">
			Selected record ID:
			<span class="font-bold">{{ componentModel }}</span>
		</p>

		<template #additional-code>
			<code-block :code="`const records = ${JSON.stringify(records, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current selected record ID.
const componentModel = ref("");

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Field label",
		value: "Record",
	},
	introduction: {
		label: "Introduction",
		value: "Type a name, then choose a record from the list.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "The selected record ID is stored in the model.",
		type: "textarea",
	},
	error: {
		label: "Error text",
		value: "",
		type: "textarea",
	},
});

const records = [
	{
		id: "record-42",
		name: "Quarterly review",
		updated: "2 July 2024",
	},
	{
		id: "record-57",
		name: "Quarterly review",
		updated: "21 May 2024",
	},
	{
		id: "record-18",
		name: "Release notes",
		updated: "26 April 2024",
	},
	{
		id: "record-03",
		name: "Design notes",
		updated: "5 May 2024",
	},
];

// Props for the component and the generated example.
const props = ref({
	options: {
		label: "Options",
		value: records,
		type: "array",
		variableName: "records",
	},
	labelKey: {
		label: "Label key",
		value: "name",
		isInline: true,
	},
	valueKey: {
		label: "Value key",
		value: "id",
		isInline: true,
	},
	placeholder: {
		label: "Placeholder",
		value: "Filter records",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to the component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

// Keep the copied example rich enough to show how matching labels can be disambiguated.
const optionTemplate = [
	'<template #option="{ option, highlighted, selected }">',
	'<div :class="{ \'font-semibold\': highlighted }" class="flex items-center justify-between gap-4">',
	'<div class="flex flex-col">',
	"<span>{{ option.name }}</span>",
	'<span class="text-content-muted text-xs">Updated: {{ option.updated }}</span>',
	"</div>",
	'<span v-if="selected" aria-hidden="true" class="text-content-muted text-xs">Selected</span>',
	"</div>",
	"</template>",
].join("\n");

const template = useTemplateGenerator("form-combo-box", {
	additionalContent: optionTemplate,
	props,
	slots: textSlots,
});
</script>
