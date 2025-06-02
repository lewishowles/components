<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-star-rating" v-model="textSlots">
		<template #title>
			Star rating (read only)
		</template>

		<template #introduction>
			<p>A basic star rating allows the user to provide a value from one to five.</p>
		</template>

		<star-rating v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>

			<template #current-rating>
				{{ textSlots["current-rating"]?.value }}
			</template>
		</star-rating>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	"default": {
		label: "Rating label",
		value: "Rating",
	},
	"introduction": {
		label: "Introduction",
		value: "Based on customer feedback received through the app.",
	},
	"current-rating": {
		label: "Current rating",
		value: "Average rating of 4.3, based on 300 reviews.",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	readOnly: {
		label: "Read only",
		value: true,
		type: "boolean",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("star-rating", { slots: textSlots, props });
</script>
