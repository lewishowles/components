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
						v-if="haveDefault"
						class="text-content-strong text-lg font-semibold"
						data-test="content-card-title"
					>
						<slot />
					</component>
				</div>

				<div v-if="haveAdditional" data-test="content-card-header-additional">
					<slot name="additional" />
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

// Whether the default slot (title text) has been provided.
const haveDefault = computed(() => isNonEmptySlot(slots.default));
// Whether an icon has been provided.
const haveIcon = computed(() => isNonEmptySlot(slots.icon));
// Whether additional header content has been provided.
const haveAdditional = computed(() => isNonEmptySlot(slots.additional));
// Whether the title area (heading + icon) should be rendered.
const haveTitleArea = computed(() => haveIcon.value || haveDefault.value);

// All attributes except class, spread onto the root element separately so that
// class can be handled via cn() without doubling up.
const attrsWithoutClass = computed(() => {
	const { class: _omitted, ...rest } = attributes;

	return rest;
});
</script>
