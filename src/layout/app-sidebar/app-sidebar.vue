<template>
	<nav class="flex flex-col p-8 text-sm">
		<router-link v-bind="{ to: { name: 'home' } }">
			<components-logo class="w-auto h-9 mr-auto" />

			<span class="sr-only">@lewishowles/components</span>
		</router-link>

		<div class="my-8 bg-gradient-to-r to-grey-200 h-px" />

		<ol>
			<app-menu-section>
				<template #title>
					Forms
				</template>

				<app-menu-item to="forms/form-field">
					form-field
				</app-menu-item>
			</app-menu-section>
		</ol>
	</nav>
</template>

<script setup>
/**
 * While `app-sidebar` could be auto-generated in some way, based on importing
 * the components from the components folder, what we're actually displaying is
 * a component showcase page, not the component itself, and by manually creating
 * our navigation menu we can more cleanly order the components based on their
 * importance, or exclude supplementary components, for example.
 */

import AppMenuItem from "./fragments/app-menu-item/app-menu-item.vue";
import AppMenuSection from "./fragments/app-menu-section/app-menu-section.vue";
import ComponentsLogo from "./fragments/components-logo/components-logo.vue";
</script>
