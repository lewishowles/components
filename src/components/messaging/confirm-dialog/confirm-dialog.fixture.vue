<script setup>
// A fixture for testing confirm-dialog's confirm outcome, since Playwright CT
// can't pass function props directly to mount(). Whether the dialog closed is
// already observable via its own modal-dialog test id.
import { ref } from "vue";

const confirmed = ref(false);

function handleConfirm() {
	confirmed.value = true;
}
</script>

<template>
	<div>
		<p v-if="confirmed" data-test="confirm-dialog-fixture-confirmed">Confirmed</p>

		<confirm-dialog v-bind="{ onConfirm: handleConfirm }">
			<template #title>Delete this vehicle?</template>

			<p>Are you sure you want to delete this vehicle?</p>
		</confirm-dialog>
	</div>
</template>
