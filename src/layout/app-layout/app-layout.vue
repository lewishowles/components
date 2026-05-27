<template>
	<div class="min-h-screen lg:flex">
		<div class="sr-only" aria-live="polite">
			{{ title }}
		</div>

		<app-sidebar class="lg:min-w-80 lg:shrink-0" />

		<div class="grow py-2 pe-2">
			<div
				class="border-grey-200 dark:bg-grey-950/20 min-h-full rounded-md border bg-white p-8 lg:p-16 dark:border-transparent"
			>
				<app-header class="hidden lg:block" />

				<div id="content">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * The main layout for the Components showcase, `app-layout` encapsulates the
 * base functionality for viewing each component.
 */
import useTitle from "@/docs/composables/use-title/use-title";

import AppHeader from "./fragments/app-header/app-header.vue";
import AppSidebar from "./fragments/app-sidebar/app-sidebar.vue";

const { title } = useTitle();
</script>
