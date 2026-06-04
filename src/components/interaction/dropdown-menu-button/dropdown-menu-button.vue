<template>
	<ui-button
		class="hocus:border-current hocus:bg-surface-subtle hocus:text-primary w-full justify-start border-s-2 px-4 py-2"
		:class="{
			'bg-surface-subtle text-primary border-current': selected,
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
