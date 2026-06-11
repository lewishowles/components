<template>
	<div :class="rootClass" data-component="form-layout" data-test="form-layout">
		<slot />
	</div>
</template>

<script setup>
import { computed, useAttrs } from "vue";
import { cn } from "@/utilities/cn.js";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

// Root element class, merging base layout with any override classes.
const rootClass = computed(() => cn("flex flex-col gap-y-8", attrs.class));
</script>
