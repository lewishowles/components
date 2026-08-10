<template>
	<div
		:class="sectionClasses"
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

// The classes applied to the section root, varying by column layout.
const sectionClasses = computed(() =>
	cn(
		"flex flex-col justify-center px-[1em] py-[0.75em]",
		{
			"flex-1 not-first:border-border not-first:border-s": inColumns,
			"border-border border not-first:border-t-0 first:rounded-t-xl last:rounded-b-xl": !inColumns,
		},
		attributes.class,
	),
);
</script>
