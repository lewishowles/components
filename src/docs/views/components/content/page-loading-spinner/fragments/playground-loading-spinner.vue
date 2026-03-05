<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-loading-spinner" v-model="textSlots">
		<template #title>
			Loading spinner
		</template>

		<template #introduction>
			<p>A simple spinner.</p>
		</template>

		<loading-spinner />
	</component-playground>
</template>

<script setup>
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const template = useTemplateGenerator("loading-spinner");
</script>
