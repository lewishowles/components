<template>
	<component-playground v-bind="{ copy: template }" id="playground-display-date-locale" v-model="textSlots">
		<template #title>
			Custom locale
		</template>

		<template #introduction>
			Display a date with the default format in a custom locale.
		</template>

		<display-date v-bind="componentProps" />

		<template #additional-code>
			<code-block :code="`const format = ${JSON.stringify(format, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

const format = {
	year: "numeric",
	day: "2-digit",
	weekday: "long",
	month: "long",
	hour: "numeric",
	dayPeriod: "long",
	minute: "numeric",
};

// Props both for the template and for the component example itself.
const props = ref({
	date: {
		label: "Date",
		value: "2025-03-29T13:15:20",
		type: "text",
	},
	locale: {
		label: "Locale",
		value: "de-DE",
		type: "text",
	},
	format: {
		label: "Format",
		value: format,
		type: "object",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("display-date", { props });
</script>
