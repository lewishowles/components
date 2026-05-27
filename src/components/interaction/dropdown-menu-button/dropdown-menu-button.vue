<template>
	<ui-button
		class="hocus:border-current hocus:bg-grey-50 hocus:text-purple-800 dark:hocus:bg-white/10 dark:hocus:text-purple-300 w-full justify-start border-s-2 px-4 py-2"
		:class="{
			'bg-grey-50 border-current text-purple-800 dark:bg-white/10 dark:text-purple-300': selected,
			'border-transparent': !selected,
		}"
		v-bind="{ iconStart: icon }"
		role="menuitem"
		data-test="dropdown-menu-button"
		@click="handleSelect"
	>
		<slot />
	</ui-button>
</template>

<script setup>
import { inject } from "vue";

defineProps({
	/**
	 * An icon to show with this button, which will appear at its start.
	 */
	icon: {
		type: String,
		default: null,
	},

	/**
	 * Whether this menu button should show a selected state.
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
