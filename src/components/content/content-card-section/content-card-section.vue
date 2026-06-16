<template>
	<div
		:class="
			cn(
				'border-border flex flex-col justify-center gap-4 border p-6 first:rounded-t-xl last:rounded-b-xl [&:not(:first-child)]:border-t-0',
				attributes.class,
			)
		"
		v-bind="attrsWithoutClass"
		data-component="content-card-section"
		data-part="section"
		data-test="content-card-section"
	>
		<slot />
	</div>
</template>

<script setup>
import { cn } from "@/utilities/cn.js";
import { computed, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attributes = useAttrs();

// All attributes except class, spread onto the root element separately so that
// class can be handled via cn() without doubling up.
const attrsWithoutClass = computed(() => {
	const { class: _omitted, ...rest } = attributes;

	return rest;
});
</script>
