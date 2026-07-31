<template>
	<alert-message v-if="!haveLabel" type="error" v-bind="{ live: false }">
		<template #title>&lt;breadcrumb-list&gt;</template>

		A `label` is required for accessibility purposes.
	</alert-message>

	<nav
		v-else
		:aria-label="label"
		:class="scrollIndicatorClasses"
		data-component="breadcrumb-list"
		data-part="nav"
		data-test="breadcrumb-list"
	>
		<ol
			ref="listReference"
			class="flex items-center gap-2 overflow-x-auto"
			data-part="list"
			data-test="breadcrumb-list-list"
		>
			<slot />
		</ol>
	</nav>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useResizeObserver, useScroll } from "@vueuse/core";

const props = defineProps({
	// i18n

	/**
	 * The label for the breadcrumbs, intended to explain to screen reader users
	 * the purpose of the navigation.
	 */
	label: {
		type: String,
		default: "Breadcrumb",
	},
});

// Whether a label for the breadcrumbs has been provided.
const haveLabel = computed(() => isNonEmptyString(props.label));
// The scroll container used to reveal the latest breadcrumb on mount.
const listReference = ref(null);
// Access scroll information.
const { arrivedState, measure, x } = useScroll(listReference, { observe: true });
// Whether the list has been positioned after its dimensions became available.
const hasPositionedAtEnd = ref(false);

// Classes that expose the current hidden-content indicators.
const scrollIndicatorClasses = computed(() => ({
	"show-left": !arrivedState.left,
	"show-right": !arrivedState.right,
}));

// When the screen resizes, re-calculate breadcrumb visibility.
useResizeObserver(listReference, () => {
	measure();
	positionListAtEnd();
});

// If the current breadcrumb list is scrollable, scroll to the end so that the
// current page is visible.
onMounted(async () => {
	await nextTick();

	const list = listReference.value;

	if (!list) {
		return;
	}

	positionListAtEnd();
});

/**
 * Scroll the breadcrumb list to the end, so the current page is visible.
 */
function positionListAtEnd() {
	const list = listReference.value;

	if (!list || hasPositionedAtEnd.value || list.clientWidth <= 0) {
		return;
	}

	x.value = list.scrollWidth;
	hasPositionedAtEnd.value = true;

	// useScroll's x setter does not update arrivedState, so measure after
	// positioning.
	measure();
}
</script>
