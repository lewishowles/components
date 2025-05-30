<template>
	<component-playground v-bind="{ copy: template }" id="playground-loading-indicator" v-model="textSlots">
		<template #title>
			Loading indicator
		</template>

		<template #introduction>
			A standard loading indicator, most suitable for when a small area of content is loading.
		</template>

		<loading-indicator>
			{{ textSlots.default?.value }}
		</loading-indicator>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";

import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Default text",
		value: "Loading users…",
	},
});

const template = useTemplateGenerator("loading-indicator", { slots: textSlots });
</script>
