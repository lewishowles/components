<template>
	<preview-wrapper>
		<template #title>
			star-rating
		</template>

		<preview-section>
			<template #title>
				Basic rating
			</template>

			<star-rating>
				Rate your experience
			</star-rating>
		</preview-section>

		<preview-section>
			<template #title>
				Component options
			</template>

			<div>
				<star-rating v-model="model">
					Basic modelled rating
				</star-rating>

				<pre>{{ model }}</pre>
			</div>

			<star-rating>
				With "current rating"

				<template #current-rating>
					<strong>4.6/5</strong> based on 300 ratings
				</template>
			</star-rating>

			<star-rating v-bind="{ shape: 'heart' }">
				Heart
			</star-rating>

			<star-rating v-bind="{ readOnly: true }">
				Read only

				<template #current-rating>
					<strong>4.6/5</strong> based on 300 ratings
				</template>
			</star-rating>

			<star-rating v-bind="{ shape: 'heart', readOnly: true }">
				Read only (heart)

				<template #current-rating>
					<strong>4.6/5</strong> based on 300 ratings
				</template>
			</star-rating>

			<div>
				<star-rating ref="focusableRadio">
					External focus test
				</star-rating>

				<ui-button class="button--muted mt-4" @click="triggerFocus">
					Focus input
				</ui-button>
			</div>

			<star-rating>
				Rate your experience

				<template #help>
					With help text
				</template>
			</star-rating>

			<star-rating>
				Rate your experience

				<template #error>
					With an error
				</template>
			</star-rating>

			<star-rating>
				Rate your experience

				<template #help>
					With help text
				</template>

				<template #error>
					With an error
				</template>
			</star-rating>

			<star-rating>
				Rate your experience

				<template #introduction>
					With introduction
				</template>
			</star-rating>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const model = ref(null);
const focusableRadio = ref(null);

function triggerFocus() {
	runComponentMethod(focusableRadio.value, "triggerFocus");
}
</script>
