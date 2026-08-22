<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-screen">
		<template #title>Form screen</template>

		<form-screen id="example-screen">
			<p>This content is visible when the screen is active inside a form-flow.</p>
		</form-screen>
	</component-playground>
</template>

<script setup>
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const template = useTemplateGenerator("form-screen", {
	props: {
		id: {
			value: "example-screen",
			isInline: true,
		},
	},
	additionalContent: ["\n\tContent shown while this screen is active."],
});
</script>
