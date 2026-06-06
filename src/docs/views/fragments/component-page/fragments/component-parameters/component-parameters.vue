<template>
	<component-tab v-bind="{ id: 'tab-parameters', icon: 'icon-object' }">
		<template #title>Parameters</template>

		<slot />
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/docs/views/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
