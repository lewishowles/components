<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-star-rating" v-model="textSlots">
		<template #title>
			Star rating
		</template>

		<template #introduction>
			<p>A basic star rating allows the user to provide a value from one to five.</p>
		</template>

		<star-rating v-model="componentModel">
			{{ textSlots.default?.value }}

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>
		</star-rating>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Rating label",
		value: "Your rating",
	},
	introduction: {
		label: "Introduction",
		value: "Based on your overall experience today, please provide a rating.",
	},
});

const template = useTemplateGenerator("star-rating", { slots: textSlots });
</script>
