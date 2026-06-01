<template>
	<component-tab v-bind="{ id: 'tab-methods', icon: 'icon-function' }">
		<template #title> Exposed methods / properties </template>

		<slot />
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/docs/views/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
