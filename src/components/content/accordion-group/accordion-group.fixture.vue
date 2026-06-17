<template>
	<accordion-group>
		<accordion-panel>
			<template #title>First panel</template>
			<p>First panel content</p>
		</accordion-panel>

		<accordion-panel>
			<template #title>Second panel</template>
			<p>Second panel content</p>
		</accordion-panel>

		<accordion-panel>
			<template #title>Third panel</template>
			<p>Third panel content</p>
		</accordion-panel>
	</accordion-group>
</template>

<script setup>
import AccordionGroup from "./accordion-group.vue";
</script>
