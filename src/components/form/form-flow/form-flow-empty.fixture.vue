<template>
	<div>
		<form-flow v-model="modelValue">
			<form-screen v-if="showScreens" id="account">
				<form-field name="email">Email address</form-field>
			</form-screen>
		</form-flow>

		<button type="button" data-test="remove-form-flow-screens" @click="showScreens = false">
			Remove screens
		</button>
	</div>
</template>

<script setup>
import { ref } from "vue";

// Keep one screen available until the test removes it.
const modelValue = ref({ email: "person@example.com" });
const showScreens = ref(true);
</script>
