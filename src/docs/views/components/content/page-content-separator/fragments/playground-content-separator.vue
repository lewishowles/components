<template>
	<component-playground v-bind="{ copy: template }" id="playground-content-separator">
		<template #title>
			Content separator
		</template>

		<template #introduction>
			<p>A decorative visual rule, hidden from screen readers.</p>
		</template>

		<content-separator />
	</component-playground>
</template>

<script setup>
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const template = useTemplateGenerator("content-separator");
</script>
