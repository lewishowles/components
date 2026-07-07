<template>
	<div
		:class="
			cn(
				'border-border flex items-center gap-4 border px-[1em] py-[0.75em] text-sm not-first:border-t-0 first:rounded-t-xl last:rounded-b-xl',
				attributes.class,
			)
		"
		v-bind="attrsWithoutClass"
		data-component="content-card-footer"
		data-part="footer"
		data-test="content-card-footer"
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
