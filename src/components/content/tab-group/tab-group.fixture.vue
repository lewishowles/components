<template>
	<tab-group>
		<template v-if="$slots.label" #label>
			<slot name="label" />
		</template>

		<tab-item>
			<template #label>First tab</template>
			<p>First tab content</p>
		</tab-item>

		<tab-item>
			<template #label>Second tab</template>
			<p>Second tab content</p>
		</tab-item>

		<tab-item>
			<template #label>Third tab</template>
			<p>Third tab content</p>
		</tab-item>
	</tab-group>
</template>

<script setup>
import TabGroup from "./tab-group.vue";
</script>
