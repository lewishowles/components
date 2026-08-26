<template>
	<div>
		<form-flow v-model="modelValue" v-bind="{ rules, schema }">
			<form-screen id="first">
				<form-field name="first">First answer</form-field>
			</form-screen>

			<form-screen id="second">
				<form-field name="second">Second answer</form-field>
			</form-screen>

			<template #submit-button-label>Save</template>
		</form-flow>

		<button type="button" data-test="invalidate-first-field" @click="invalidateFirst = true">
			Make first answer invalid
		</button>
		<button type="button" data-test="show-root-error" @click="showRootError = true">
			Show root error
		</button>
	</div>
</template>

<script setup>
import { ref } from "vue";

// Seed data valid for both screens; tests flip it invalid via the buttons
// below to trigger routing.
const modelValue = ref({ first: "ready", second: "ready" });
// Toggled by the "Show root error" button to make the schema report a
// root issue.
const showRootError = ref(false);
// Toggled by the "Make first answer invalid" button to make the schema
// report an issue for the "first" field.
const invalidateFirst = ref(false);

// A minimal Standard Schema stub: reports a root issue when showRootError
// is on, an issue on "first" when invalidateFirst is on, otherwise passes.
const schema = {
	"~standard": {
		validate: (value) => {
			if (showRootError.value) {
				return Promise.resolve({
					issues: [{ message: "The form is not ready to submit", path: [] }],
				});
			}

			if (invalidateFirst.value) {
				return Promise.resolve({
					issues: [{ message: "First answer is required", path: ["first"] }],
				});
			}

			return Promise.resolve({ value });
		},
	},
};

// Required rules for both fields; "second" stays required so submitting
// still validates it alongside the schema-driven "first" issue above.
const rules = {
	first: [{ rule: "required", message: "First answer is required" }],
	second: [{ rule: "required", message: "Second answer is required" }],
};
</script>
