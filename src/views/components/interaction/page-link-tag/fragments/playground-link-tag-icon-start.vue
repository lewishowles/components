<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-link-tag" v-model="textSlots">
		<template #title>
			Icon link
		</template>

		<template #introduction>
			<p>A link with an icon prefix.</p>
		</template>

		<link-tag v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}
		</link-tag>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Link text",
		value: "Add user",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	href: {
		label: "href",
		value: "#",
	},
	iconStart: {
		label: "Icon prefix",
		value: "icon-plus",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("link-tag", { slots: textSlots, props });
</script>
