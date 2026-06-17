<script setup>
defineProps({
	// Whether to include a label slot.
	showLabel: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<loading-skeleton>
		<template #default>
			<loading-skeleton-indicator style="height: 1rem" />
		</template>

		<template v-if="showLabel" #label>Loading user data</template>
	</loading-skeleton>
</template>
