<template>
	<component-tab v-bind="{ id: 'tab-provides', icon: 'icon-arrow-down' }">
		<template #title>
			Provides
		</template>

		<template #post-title>
			<slot name="introduction" />
		</template>

		<slot />
	</component-tab>
</template>

<script setup>
import ComponentTab from "@/docs/views/components/fragments/component-page/fragments/component-tab/component-tab.vue";
</script>
