<template>
	<div
		:class="
			cn(
				'border-border border px-6 py-4 first:rounded-t-xl last:rounded-b-xl [&:not(:first-child)]:border-t-0',
				attributes.class,
			)
		"
		v-bind="attrsWithoutClass"
		data-component="content-card-header"
		data-part="header"
		data-test="content-card-header"
	>
		<slot name="header">
			<div class="flex items-center justify-between gap-14">
				<div v-if="haveTitleArea" class="flex items-center justify-between gap-2">
					<div v-if="haveIcon" :class="iconClasses" data-test="content-card-icon">
						<slot name="icon" />
					</div>

					<component
						:is="headingLevel"
						v-if="haveTitle"
						class="text-content-strong text-xl font-bold"
						data-test="content-card-title"
					>
						<slot name="title" />
					</component>
				</div>

				<div v-if="haveHeaderAdditional" data-test="content-card-header-additional">
					<slot name="header-additional" />
				</div>
			</div>
		</slot>
	</div>
</template>

<script setup>
import { cn } from "@/utilities/cn.js";
import { computed, useAttrs, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

defineOptions({ inheritAttrs: false });

defineProps({
	/**
	 * The heading level to use for the title.
	 */
	headingLevel: {
		type: String,
		default: "h2",
	},

	/**
	 * Classes to apply around the icon slot.
	 */
	iconClasses: {
		type: [String, Array, Object],
		default: "text-primary",
	},
});

const attributes = useAttrs();
const slots = useSlots();

const haveTitle = computed(() => isNonEmptySlot(slots.title));
const haveIcon = computed(() => isNonEmptySlot(slots.icon));
const haveHeaderAdditional = computed(() => isNonEmptySlot(slots["header-additional"]));
const haveTitleArea = computed(() => haveIcon.value || haveTitle.value);

// All attributes except class, spread onto the root element separately so that
// class can be handled via cn() without doubling up.
const attrsWithoutClass = computed(() => {
	const { class: _omitted, ...rest } = attributes;

	return rest;
});
</script>
