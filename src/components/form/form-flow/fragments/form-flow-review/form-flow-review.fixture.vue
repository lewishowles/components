<!-- This fixture supplies browser-local summary data for form-flow-review tests. -->
<template>
	<form-flow-review v-bind="{ summaries }" />
</template>

<script setup>
import { h } from "vue";

import FormFlowReview from "./form-flow-review.vue";

// Render the custom answer summary supplied for the account plan field.
const customAnswerSummary = ({ answer }) => h("strong", { "data-test": "custom-answer" }, answer);

// Review data with a default answer and a custom answer renderer.
const summaries = [
	{
		id: "account",
		title: "Account details",
		fields: [
			{ fieldName: "email", label: "Email address", answer: "person@example.com" },
			{
				answer: "Professional",
				answerSummary: customAnswerSummary,
				fieldName: "plan",
				label: "Plan",
			},
		],
	},
];
</script>
