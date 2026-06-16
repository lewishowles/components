<template>
	<component-playground
		v-bind="{ copy: basicFormSource, componentModel }"
		id="playground-form-wrapper"
	>
		<template #title>Form wrapper</template>

		<BasicForm v-model="componentModel" />
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import BasicForm from "@/components/form/form-wrapper/examples/basic-form.vue";
import basicFormSource from "@/components/form/form-wrapper/examples/basic-form.vue?raw";

// Observed via v-model on BasicForm; passed to component-playground to display.
const componentModel = ref(null);
</script>
