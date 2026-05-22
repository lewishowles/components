<template>
	<div class="flex flex-col" data-test="content-card">
		<div v-if="haveHeader" :class="headerClasses" data-test="content-card-header">
			<slot name="header">
				<div class="flex items-center justify-between gap-14">
					<div v-if="haveTitleArea" class="flex items-center justify-between gap-2">
						<div v-if="haveIcon" :class="iconClasses" data-test="content-card-icon">
							<slot name="icon" />
						</div>

						<component
							:is="headingLevel"
							v-if="haveTitle"
							class="text-grey-950 text-xl font-bold"
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

		<div v-if="haveDefault" :class="bodyClasses" data-test="content-card-body">
			<slot />
		</div>

		<div v-if="haveFooter" :class="footerClasses" data-test="content-card-footer">
			<slot name="footer" />
		</div>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * The heading level to use for the title.
	 */
	headingLevel: {
		type: String,
		default: "h2",
	},

	/**
	 * The footer style to use.
	 */
	footerVariant: {
		type: String,
		default: "well",
	},

	/**
	 * Classes to apply around the icon slot.
	 */
	iconClasses: {
		type: [String, Array, Object],
		default: "text-purple-800",
	},
});

// Footer presentation options.
const footerVariants = {
	PLAIN: "plain",
	WELL: "well",
};

const slots = useSlots();

// Whether a custom header has been provided.
const haveCustomHeader = computed(() => isNonEmptySlot(slots.header));
// Whether a title has been provided.
const haveTitle = computed(() => isNonEmptySlot(slots.title));
// Whether an icon has been provided.
const haveIcon = computed(() => isNonEmptySlot(slots.icon));
// Whether additional header content has been provided.
const haveHeaderAdditional = computed(() => isNonEmptySlot(slots["header-additional"]));
// Whether default card content has been provided.
const haveDefault = computed(() => isNonEmptySlot(slots.default));
// Whether footer content has been provided.
const haveFooter = computed(() => isNonEmptySlot(slots.footer));
// Whether the default header title area should be rendered.
const haveTitleArea = computed(() => haveIcon.value || haveTitle.value);

// Whether the card header should be rendered.
const haveHeader = computed(
	() => haveCustomHeader.value || haveTitleArea.value || haveHeaderAdditional.value,
);

// Classes for the header shell.
const headerClasses = computed(() => [
	"border-grey-200 rounded-t-xl border px-6 py-4",
	{
		"rounded-b-xl": !haveDefault.value && !haveFooter.value,
	},
]);

// Classes for the main card body.
const bodyClasses = computed(() => [
	"border-grey-200 flex flex-col justify-center gap-4 border p-6",
	{
		"rounded-t-xl": !haveHeader.value,
		"rounded-b-xl": !haveFooter.value,
		"border-t-0": haveHeader.value,
		"border-b-0": haveFooter.value,
	},
]);

// Classes for the card footer.
const footerClasses = computed(() => [
	"border-grey-200 flex items-center gap-4 rounded-b-xl border px-6 py-4 text-sm",
	{
		"bg-grey-50": props.footerVariant === footerVariants.WELL,
		"border-t-0": haveHeader.value && !haveDefault.value,
		"rounded-t-xl": !haveHeader.value && !haveDefault.value,
	},
]);
</script>
