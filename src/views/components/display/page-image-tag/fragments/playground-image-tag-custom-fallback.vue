<template>
	<component-playground v-bind="{ copy: template }" id="playground-image-tag" v-model="textSlots">
		<template #title>
			Custom fallback
		</template>

		<template #introduction>
			Displaying a custom fallback if an image fails to load.
		</template>

		<image-tag v-bind="componentProps">
			<template #fallback>
				<div class="border-s-4 border-red-700 p-2">
					<icon-danger class="text-red-700" />
				</div>
			</template>
		</image-tag>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({
	src: {
		label: "Source",
		value: "#",
		type: "text",
		isInline: true,
	},
	class: {
		label: "Class",
		value: "size-25",
		type: "text",
		isInline: true,
	},
});

const slots = {
	fallback: {
		value: useTemplateGenerator("div", {
			props: {
				class: { value: "border-s-4 border-red-700 p-2", isInline: true },
			},
			slots: {
				default: {
					value: useTemplateGenerator("icon-danger", {
						props: {
							class: { value: "text-red-700", isInline: true },
						},
					}),
				},
			},
			indent: 2,
		}),
	},
};

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("image-tag", { props, slots });
</script>
