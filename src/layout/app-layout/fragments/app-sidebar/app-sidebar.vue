<template>
	<nav class="flex justify-between items-center gap-8 p-8 text-sm lg:flex-col lg:justify-start lg:items-start">
		<router-link v-bind="{ to: { name: 'home' } }">
			<components-logo class="w-auto h-9 mr-auto" />

			<span class="sr-only">@lewishowles/components</span>
		</router-link>

		<div class="hidden lg:block bg-gradient-to-r from-grey-200 dark:from-white/20 h-px" />

		<app-menu />
	</nav>
</template>

<script setup>
import AppMenu from "./fragments/app-menu/app-menu.vue";
import ComponentsLogo from "./fragments/components-logo/components-logo.vue";
</script>
