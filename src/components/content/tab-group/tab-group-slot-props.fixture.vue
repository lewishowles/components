<template>
	<tab-group>
		<tab-item>
			<template #label="{ isActive }">
				<span data-test="tab-label" :data-active="String(isActive)">First tab</span>
			</template>

			<template #default="{ isActive }">
				<p data-test="panel-content" :data-active="String(isActive)">First tab content</p>
			</template>
		</tab-item>

		<tab-item>
			<template #label="{ isActive }">
				<span data-test="tab-label" :data-active="String(isActive)">Second tab</span>
			</template>

			<template #default="{ isActive }">
				<p data-test="panel-content" :data-active="String(isActive)">Second tab content</p>
			</template>
		</tab-item>
	</tab-group>
</template>

<script setup>
import TabGroup from "./tab-group.vue";
</script>
