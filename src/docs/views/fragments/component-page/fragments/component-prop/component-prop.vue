<template>
	<component-tab-section>
		<template #title>
			<slot name="name" />
		</template>

		<template #type>
			<slot name="type" />
		</template>

		<template #default-value>
			<slot name="default-value" />
		</template>

		<slot />
	</component-tab-section>
</template>

<script setup>
import ComponentTabSection from "../component-tab-section/component-tab-section.vue";
</script>
