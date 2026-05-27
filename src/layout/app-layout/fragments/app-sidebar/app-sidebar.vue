<template>
	<nav
		class="flex items-center justify-between gap-8 p-8 text-sm lg:flex-col lg:items-start lg:justify-start lg:pt-4.75"
	>
		<router-link v-bind="{ to: { name: 'home' } }">
			<components-logo class="mr-auto h-9 w-auto" />

			<span class="sr-only">@lewishowles/components</span>
		</router-link>

		<div class="from-grey-200 hidden h-px bg-linear-to-r lg:block dark:from-white/20" />

		<app-menu />
	</nav>
</template>

<script setup>
import AppMenu from "./fragments/app-menu/app-menu.vue";
import ComponentsLogo from "./fragments/components-logo/components-logo.vue";
</script>
