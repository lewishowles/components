<template>
	<summary-details v-bind="{ floating: true, closeWithClickOutside: true, align: 'end', summaryClasses, detailsClasses: [detailsClasses, 'w-screen', maxWidthClass] }" data-test="floating-menu">
		<template #summary>
			<slot name="summary" />
		</template>

		<slot />
	</summary-details>
</template>

<script setup>
defineProps({
	/**
	 * Whether to align to the dropdown to the start or end of the summary. This
	 * is useful for menus that open to the end of the screen, for example.
	 * Anything but "start" will be treated as "end".
	 */
	align: {
		type: String,
		default: "start",
	},

	/**
	 * Any classes to add to the summary element, allowing styling to wrap both
	 * the summary and icons.
	 */
	summaryClasses: {
		type: [String, Array, Object],
		default: "button--muted",
	},

	/**
	 * Any classes to add to the details content.
	 */
	detailsClasses: {
		type: [String, Array, Object],
		default: "mt-3 rounded-md border border-grey-200 bg-white p-4 shadow",
	},

	/**
	 * A class to add to detailsClasses to set a max width, allowing the size of
	 * the menu to be changed without affecting its appearance.
	 */
	maxWidthClass: {
		type: String,
		default: "max-w-lg",
	},
});
</script>
