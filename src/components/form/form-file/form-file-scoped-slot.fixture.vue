<template>
	<form-file v-model="files" multiple>
		Supporting documents

		<template #remove-button-label="{ files: selectedFiles }">
			Clear {{ selectedFiles.length }} files
		</template>
	</form-file>
</template>

<script setup>
import { ref } from "vue";
import FormFile from "./form-file.vue";

// The files selected through the native input.
const files = ref(null);
</script>
