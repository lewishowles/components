<template>
	<component-playground v-bind="{ copy: template }" id="playground-content-separator">
		<template #title> Content separator </template>

		<template #introduction>
			<p>
				A decorative visual rule, hidden from screen readers. Use <code>tag="hr"</code> for a break
				in content.
			</p>
		</template>

		<content-separator v-bind="componentProps" />
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({
	tag: {
		label: "Tag",
		value: "div",
		type: "string",
	},
	orientation: {
		label: "Orientation",
		value: "horizontal",
		type: "string",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("content-separator", { props });
</script>
