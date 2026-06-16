<template>
	<div
		:class="cn(sectionClasses, attributes.class)"
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
import { computed, inject, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attributes = useAttrs();

// Whether this section is inside a content-card-columns container, which
// changes how borders and layout are applied.
const inColumns = inject("content-card-columns", false);

// All attributes except class, spread onto the root element separately so that
// class can be handled via cn() without doubling up.
const attrsWithoutClass = computed(() => {
	const { class: _omitted, ...rest } = attributes;

	return rest;
});

// Base classes differ depending on whether this section is a direct card child
// or a column inside content-card-columns.
const sectionClasses = computed(() => {
	if (inColumns) {
		return "flex flex-1 flex-col justify-center p-6 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-border";
	}

	return "border-border flex flex-col justify-center border p-6 first:rounded-t-xl last:rounded-b-xl [&:not(:first-child)]:border-t-0";
});
</script>
