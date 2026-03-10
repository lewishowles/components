<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-content-divider" v-model="textSlots">
		<template #title>
			Content divider
		</template>

		<template #introduction>
			<p>A simple divider</p>
		</template>

		<content-divider />
	</component-playground>
</template>

<script setup>
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const template = useTemplateGenerator("content-divider");
</script>
