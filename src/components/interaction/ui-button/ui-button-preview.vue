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

				<ui-button class="button--muted" v-bind="{ iconOnly: true, iconEnd: 'icon-chevron-right' }">
					Icon only
				</ui-button>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Reactive buttons
			</template>

			<div class="flex flex-wrap gap-6">
				<ui-button ref="reactiveButton" class="button--muted" v-bind="{ iconStart: 'icon-user', reactive: true }" @click="reacted = true">
					Reactive button
				</ui-button>

				<div v-if="reacted" class="flex w-full items-center gap-4">
					Reacted!

					<button type="button" class="button--muted" @click="reset">
						Reset
					</button>
				</div>
			</div>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref, useTemplateRef } from "vue";

const reacted = ref(false);
const reactiveButton = useTemplateRef("reactiveButton");

function reset() {
	reacted.value = false;

	reactiveButton.value.reset();
}
</script>
