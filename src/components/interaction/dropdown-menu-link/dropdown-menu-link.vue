<template>
	<link-tag
		class="w-full border-s-2 px-4 py-2 hocus:border-current hocus:bg-grey-50 dark:hocus:bg-white/10"
		:class="{
			'border-current bg-grey-50 dark:bg-white/10': selected,
			'border-transparent': !selected,
		}"
		role="menuitem"
		data-test="dropdown-menu-link"
		@click="handleSelect"
	>
		<slot />
	</link-tag>
</template>

<script setup>
import { inject } from "vue";

defineProps({
	/**
	 * Whether this menu link should show a selected state.
	 */
	selected: {
		type: Boolean,
		default: false,
	},
});

// Functions provided by the parent dropdown-menu, keyed by component name.
const { selectMenuItem } = inject("dropdown-menu", {});

/**
 * Handle selection of this menu item, notifying the parent dropdown-menu so
 * it can close and restore focus to the trigger.
 */
function handleSelect() {
	selectMenuItem?.();
}
</script>
