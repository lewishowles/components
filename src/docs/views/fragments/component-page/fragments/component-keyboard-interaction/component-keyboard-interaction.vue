<template>
	<component-tab v-bind="{ id: 'tab-keyboard-interaction', icon: 'icon-keyboard' }">
		<template #title>Keyboard interaction</template>

		<slot />
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/docs/views/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
