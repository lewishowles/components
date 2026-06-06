<template>
	<component-tab v-bind="{ id: 'tab-styling-hooks', icon: 'icon-pencil' }">
		<template #title>Styling hooks</template>

		<slot />
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/docs/views/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
