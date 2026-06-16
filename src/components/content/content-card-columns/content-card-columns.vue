<template>
	<div
		:class="
			cn(
				'border-border flex flex-row border first:rounded-t-xl last:rounded-b-xl [&:not(:first-child)]:border-t-0',
				attributes.class,
			)
		"
		v-bind="attrsWithoutClass"
		data-component="content-card-columns"
		data-part="columns"
		data-test="content-card-columns"
	>
		<slot />
	</div>
</template>

<script setup>
import { cn } from "@/utilities/cn.js";
import { computed, provide, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attributes = useAttrs();

provide("content-card-columns", true);

// All attributes except class, spread onto the root element separately so that
// class can be handled via cn() without doubling up.
const attrsWithoutClass = computed(() => {
	const { class: _omitted, ...rest } = attributes;

	return rest;
});
</script>
