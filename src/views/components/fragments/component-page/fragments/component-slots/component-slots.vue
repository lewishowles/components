<template>
	<component-tab v-bind="{ id: 'tab-slots', icon: 'icon-slot' }">
		<template #title>
			Slots
		</template>

		<slot />
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/views/components/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
