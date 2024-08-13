<template>
	<preview-wrapper>
		<template #title>
			ui-button
		</template>

		<preview-section>
			<template #title>
				Base buttons
			</template>

			<div class="flex flex-wrap gap-6">
				<ui-button class="button--primary">
					Primary
				</ui-button>
				<ui-button class="button--muted">
					Muted
				</ui-button>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Icon buttons
			</template>

			<div class="flex flex-wrap gap-6">
				<ui-button class="button--muted" icon-start="icon-chevron-left">
					Chevron left
				</ui-button>
				<ui-button class="button--muted" icon-end="icon-chevron-right">
					Chevron right
				</ui-button>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Reactive buttons
			</template>

			<div class="flex flex-wrap gap-6">
				<ui-button ref="reactiveButtonRef" class="button--muted" v-bind="{ reactive: true }" @click="reacted = true">
					Reactive button
				</ui-button>

				<div v-if="reacted" class="w-full rounded bg-blue-100 p-4 text-blue-800">
					Reacted!

					<button type="button" class="button ms-4 rounded-md bg-blue-800 text-white" @click="reset">
						Reset
					</button>
				</div>
			</div>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

import PreviewSection from "@/preview/preview-section.vue";
import PreviewWrapper from "@/preview/preview-wrapper.vue";

const reacted = ref(false);
const reactiveButtonRef = ref(null);

function reset() {
	reacted.value = false;

	reactiveButtonRef.value.reset();
}
</script>
