<template>
	<component-playground
		v-bind="{ copy: compactFormSource, componentModel }"
		id="playground-compact-form-wrapper"
	>
		<template #title>Compact form</template>

		<CompactForm v-model="componentModel" />
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import CompactForm from "@/components/form/form-wrapper/examples/compact-form.vue";
import compactFormSource from "@/components/form/form-wrapper/examples/compact-form.vue?raw";

const componentModel = ref(null);
</script>
