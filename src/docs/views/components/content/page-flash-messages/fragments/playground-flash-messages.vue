<template>
	<component-playground v-bind="{ copy: template }" id="playground-flash-messages">
		<template #title> Namespaced messages </template>

		<template #introduction>
			<p>A namespaced flash message shown by the matching message outlet.</p>
		</template>

		<flash-messages v-bind="componentProps" />
	</component-playground>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useFlashMessages } from "@/composables";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const { clearMessages, sendMessage } = useFlashMessages();

// Props both for the template and for the component example itself.
const props = ref({
	namespace: {
		label: "namespace",
		value: "docs-flash-messages",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("flash-messages", { props });

onMounted(() => {
	clearMessages("docs-flash-messages");
	sendMessage({
		namespace: "docs-flash-messages",
		type: "success",
		title: "User approved",
		message: "The user has been approved.",
	});
});

onUnmounted(() => {
	clearMessages("docs-flash-messages");
});
</script>
