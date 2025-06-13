<template>
	<component-playground v-bind="{ copy: template }" id="playground-display-date-locale" v-model="textSlots">
		<template #title>
			Custom locale
		</template>

		<template #introduction>
			Display a date a custom date format, locale, and time zone.
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
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
};

// Props both for the template and for the component example itself.
const props = ref({
	date: {
		label: "Date",
		value: "2025-03-03T02:00:00+09:00[Asia/Seoul]",
		type: "text",
	},
	locale: {
		label: "Locale",
		value: "ko-KR",
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
