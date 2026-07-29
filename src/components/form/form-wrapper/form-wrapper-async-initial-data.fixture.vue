<template>
	<form-wrapper v-model="formData" :initial-data="initialData" :record-id="recordId">
		<template #pre-form>
			<div class="mb-6 flex gap-2">
				<button type="button" class="button--muted" @click="resolveInitialRecord">
					Load first record
				</button>
				<button type="button" class="button--muted" @click="loadNextRecord">
					Load next record
				</button>
			</div>
		</template>

		<form-field v-model="formData.username" v-bind="{ name: 'username', required: true }">
			Username
		</form-field>

		<template #submit-button-label>Save</template>
	</form-wrapper>
</template>

<script setup>
import { ref } from "vue";

const formData = defineModel({ default: () => ({}) });
const source = ref(null);
const recordId = ref(1);

// The form waits for this getter's async source instead of seeding from v-model.
const initialData = () => source.value;

/**
 * Resolve the first record after the form has already mounted.
 */
function resolveInitialRecord() {
	source.value = { username: "Alice" };
}

/**
 * Change the record identity before its replacement data becomes available.
 */
async function loadNextRecord() {
	recordId.value = 2;
	source.value = null;

	await Promise.resolve();

	source.value = { username: "Bob" };
}
</script>
