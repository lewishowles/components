<template>
	<floating-details>
		<template #summary>Summary label</template>

		<template #default="{ close }">
			<button data-test="close-button" @click="close">Close</button>
		</template>
	</floating-details>
</template>

<script setup>
import FloatingDetails from "./floating-details.vue";
</script>
