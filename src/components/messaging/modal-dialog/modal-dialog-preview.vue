<template>
	<preview-wrapper>
		<template #title>
			modal-dialog
		</template>

		<preview-section>
			<template #title>
				Simple modal dialog
			</template>

			<ui-button class="button--muted" @click="openDialog">
				Open dialog
			</ui-button>

			<modal-dialog ref="simpleDialog">
				<template #title>
					Delete your account
				</template>

				Are you sure you want to delete your account? This cannot be undone.

				<template #actions>
					<ui-button class="button--danger" @click="deleteAccount">
						Delete my account
					</ui-button>

					<ui-button class="button--muted" @click="closeDialog">
						Close dialog from parent.
					</ui-button>
				</template>
			</modal-dialog>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const simpleDialog = ref(null);

function openDialog() {
	runComponentMethod(simpleDialog.value, "open");
}

function closeDialog() {
	runComponentMethod(simpleDialog.value, "close");
}
</script>
