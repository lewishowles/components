<template>
	<component-tab v-bind="{ id: 'tab-props', icon: 'icon-object' }">
		<template #title>
			Props
		</template>

		<slot />
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/docs/views/components/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
