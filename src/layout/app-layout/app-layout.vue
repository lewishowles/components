<template>
	<div class="flex min-h-screen">
		<app-sidebar class="shrink-0 min-w-80" />

		<div class="grow py-2 pe-2">
			<div class="rounded-md border border-grey-200 bg-white p-16 min-h-full">
				<div class="pt-[2px] px-[2px] -mt-16 -mx-16 mb-16 text-sm">
					<div class="p-2 bg-grey-50 rounded-sm flex justify-end">
						<ui-button class="button--muted" icon-start="icon-moon">
							View in dark mode
						</ui-button>
					</div>
				</div>

				<slot />
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * The main layout for the Components showcase, `app-layout` encapsulates the
 * base functionality for viewing each component.
 */
import AppSidebar from "@/layout/app-sidebar/app-sidebar.vue";
</script>
