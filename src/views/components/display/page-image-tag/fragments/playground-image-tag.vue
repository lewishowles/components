<template>
	<component-playground v-bind="{ copy: template }" id="playground-image-tag" v-model="textSlots">
		<template #title>
			Image tag
		</template>

		<template #introduction>
			A simple image tag.
		</template>

		<image-tag v-bind="componentProps" />
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({
	src: {
		label: "Source",
		value: "https://placehold.co/100x100/6A21A7/FFF.png",
		type: "text",
		isInline: true,
	},
	class: {
		label: "Class",
		value: "size-25 rounded-lg",
		type: "text",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("image-tag", { props });
</script>
