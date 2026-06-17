<script setup>
import { useFlashMessages } from "@/composables";

const { sendMessage } = useFlashMessages();

// Send a global message before render so the custom slot receives it.
sendMessage({ type: "success", title: "Alert approved", message: "The alert has been approved." });
</script>

<template>
	<flash-messages>
		<template #default="{ message }">
			<p data-test="custom-flash-message">{{ message.title }}: {{ message.message }}</p>
		</template>
	</flash-messages>
</template>
