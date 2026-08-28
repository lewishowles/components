<template>
	<div data-test="form-flow-review-content">
		<section
			v-for="summary in props.summaries"
			:key="summary.id"
			class="mbs-8"
			data-part="review-screen"
			data-test="form-flow-review-screen"
		>
			<h3
				class="text-content-strong mbe-4 text-lg font-bold"
				data-part="review-screen-title"
				data-test="form-flow-review-screen-title"
			>
				{{ summary.title }}
			</h3>

			<dl class="border-border border-bs">
				<div
					v-for="field in summary.fields"
					:key="field.fieldName"
					class="border-border grid gap-x-4 gap-y-1 border-be p-4 last:border-be-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]"
				>
					<dt class="font-semibold">{{ field.label }}</dt>
					<dd>
						<component
							v-if="field.answerSummary"
							:is="field.answerSummary"
							v-bind="{
								answer: field.answer,
								fieldName: field.fieldName,
								label: field.label,
							}"
						/>
						<template v-else-if="field.answer !== undefined">{{ field.answer }}</template>
					</dd>
					<dd>
						<ui-button
							type="button"
							class="hocus:underline text-primary"
							@click="emit('change', { fieldName: field.fieldName, screenId: summary.id })"
						>
							Change
							<span class="sr-only">{{ field.label }} on {{ summary.title }}</span>
						</ui-button>
					</dd>
				</div>
			</dl>
		</section>
	</div>
</template>

<script setup>
const props = defineProps({
	/**
	 * One entry per completed screen, each with its title and answered fields.
	 */
	summaries: {
		type: Array,
		default: () => [],
	},
});

// Reports the field a Change button was activated for, back to form-flow.
const emit = defineEmits(["change"]);
</script>
