<script setup>
defineProps({
	scenario: {
		type: String,
		default: "section-only",
	},
});
</script>

<template>
	<content-card v-if="scenario === 'section-only'">
		<content-card-section>Card content</content-card-section>
	</content-card>

	<content-card v-else-if="scenario === 'with-header'">
		<content-card-header>
			<template #default>Card title</template>
			<template #icon><svg data-test="card-example-icon" /></template>
			<template #header-additional>Card actions</template>
		</content-card-header>
		<content-card-section>Card content</content-card-section>
	</content-card>

	<content-card v-else-if="scenario === 'heading-h3'">
		<content-card-header heading-level="h3">Card title</content-card-header>
		<content-card-section>Card content</content-card-section>
	</content-card>

	<content-card v-else-if="scenario === 'multiple-sections'">
		<content-card-section>First section</content-card-section>
		<content-card-section>Second section</content-card-section>
	</content-card>

	<content-card v-else-if="scenario === 'custom-header'">
		<content-card-header>
			<template #header>
				<div data-test="custom-card-header">Custom header</div>
			</template>
		</content-card-header>
		<content-card-section>Card content</content-card-section>
	</content-card>

	<content-card v-else-if="scenario === 'with-footer'">
		<content-card-section>Card content</content-card-section>
		<content-card-footer>Card footer</content-card-footer>
	</content-card>
</template>
