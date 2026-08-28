<!-- Review-enabled flow used by Playwright review destination tests. -->
<template>
	<form-flow v-model="modelValue" v-bind="{ enableReview: true, rules }" @submit="handleSubmit">
		<form-screen id="account">
			<template #title>Account details</template>
			<form-field name="email">Email address</form-field>
		</form-screen>

		<form-screen id="profile">
			<template #title>Profile details</template>
			<form-field name="displayName">Display name</form-field>
		</form-screen>

		<template #submit-button-label>Submit application</template>
	</form-flow>

	<p v-if="submitted" data-test="form-flow-review-submitted">Submitted</p>
</template>

<script setup>
import { ref } from "vue";

// The fixture keeps one answer prefilled so the review journey can focus on navigation.
const modelValue = ref({ email: "person@example.com", displayName: "" });
// Whether the flow's final submit handler has run.
const submitted = ref(false);

// Each screen owns only the validation rule for its registered field.
const rules = {
	email: [{ rule: "required", message: "Email address is required" }],
	displayName: [{ rule: "required", message: "Display name is required" }],
};

/**
 * Record that the flow reached final submission from the review destination.
 */
function handleSubmit() {
	submitted.value = true;
}
</script>
