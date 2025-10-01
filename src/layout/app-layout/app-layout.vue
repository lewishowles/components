<template>
	<div class="lg:flex min-h-screen">
		<div class="sr-only" aria-live="polite">
			{{ title }}
		</div>

		<app-sidebar class="lg:shrink-0 lg:min-w-80" />

		<div class="grow py-2 pe-2">
			<div class="rounded-md border border-grey-200 bg-white p-8 lg:p-16 min-h-full dark:border-transparent dark:bg-grey-950/20">
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
