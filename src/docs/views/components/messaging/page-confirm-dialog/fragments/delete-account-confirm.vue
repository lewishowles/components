<template>
	<confirm-dialog danger v-bind="{ onConfirm, onClose }">
		<template #title>Delete your account</template>

		<p>Are you sure you want to delete your account? This cannot be undone.</p>

		<template #confirm-button-label>Delete my account</template>
	</confirm-dialog>
</template>

<script setup>
defineProps({
	/**
	 * Called when the confirm action is chosen.
	 */
	onConfirm: {
		type: Function,
		default: null,
	},

	/**
	 * Called when this dialog closes, for any reason.
	 */
	onClose: {
		type: Function,
		default: null,
	},
});
</script>
