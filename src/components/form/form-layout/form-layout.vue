<template>
	<div :class="rootClass" data-component="form-layout" data-test="form-layout">
		<slot />
	</div>
</template>

<script setup>
import { computed, inject, useAttrs } from "vue";
import { cn } from "@/utilities/cn.js";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const { isCompact } = inject("form", {});

const rootClass = computed(() =>
	cn("flex flex-col", isCompact?.value ? "gap-y-4" : "gap-y-8", attrs.class),
);
</script>
