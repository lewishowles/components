<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-alert-message" v-model="textSlots">
		<template #title>
			Muted alert message
		</template>

		<alert-message v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}

			<template #title>
				{{ textSlots.title?.value }}
			</template>
		</alert-message>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	title: {
		label: "Title",
		value: "Did you know?",
	},
	default: {
		label: "Message",
		value: "You can come back later if you don't have all of the user's information to hand.",
	},
});

// Props both for the template and for the component example itself.
const props = ref({});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("alert-message", { slots: textSlots, props });
</script>
