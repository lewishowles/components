<template>
	<component-playground
		v-bind="{ copy: asyncInitialDataSource, componentModel }"
		id="playground-async-initial-data"
	>
		<template #title>Async initial data</template>

		<AsyncInitialDataForm v-model="componentModel" />
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import AsyncInitialDataForm from "@/components/form/form-wrapper/examples/async-initial-data-form.vue";
import asyncInitialDataSource from "@/components/form/form-wrapper/examples/async-initial-data-form.vue?raw";

// Observed via v-model on the async form fixture.
const componentModel = ref({});
</script>
