<template>
	<preview-wrapper>
		<template #title>
			Icons
		</template>

		<div class="grid grid-cols-[min-content_max-content] gap-4">
			<div v-for="(icon, iconName) in iconComponents" :key="iconName" class="group col-span-2 grid grid-cols-subgrid items-center rounded-lg p-2 transition-colors hover:bg-purple-100 hover:text-purple-600">
				<component :is="iconName" />

				<code class="text-grey-500 transition-colors group-hover:text-current">{{ iconName }}</code>
			</div>
		</div>
	</preview-wrapper>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const importedComponents = import.meta.glob(["./**/*.vue", "!./base-icon/base-icon.vue"]);

const iconComponents = {};

for (const path in importedComponents) {
	const componentName = path.split("/").pop().replace(".vue", "");

	iconComponents[componentName] = defineAsyncComponent(importedComponents[path]);
}
</script>
