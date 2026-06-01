<template>
	<component-tab v-bind="{ id: 'tab-events', icon: 'icon-megaphone' }">
		<template #title> Events </template>

		<slot />
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/docs/views/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
