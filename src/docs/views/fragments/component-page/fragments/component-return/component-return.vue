<template>
	<component-tab-section>
		<template #title>
			<slot name="name" />
		</template>

		<template #type>
			<slot name="type" />
		</template>

		<slot />
	</component-tab-section>
</template>

<script setup>
import ComponentTabSection from "../component-tab-section/component-tab-section.vue";
</script>
