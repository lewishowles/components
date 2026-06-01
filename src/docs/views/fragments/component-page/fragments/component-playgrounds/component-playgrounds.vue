<template>
	<component-tab v-bind="{ id: 'tab-playground', icon: 'icon-code' }">
		<template #title> Playground </template>

		<template #default>
			<slot name="additional-content" />
		</template>

		<template #post-content>
			<slot />
		</template>
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/docs/views/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
