<template>
	<div
		ref="container"
		class="relative"
		:class="{ 'z-10': isOpen }"
		data-component="combo-box"
		data-test="combo-box"
	>
		<form-input
			ref="input"
			v-model="query"
			v-bind="{ id, placeholder, inputAttributes }"
			data-part="input"
			data-test="combo-box-input"
			@keydown="handleKeydown"
			@focusin="handleFocusin"
			@focusout="handleFocusout"
		>
			<slot name="label" />

			<template #introduction>
				<slot name="introduction" />
			</template>
		</form-input>

		<span aria-live="polite" class="sr-only" data-test="combo-box-announcement">
			<template v-if="isOpen">
				<template v-if="haveItems">
					{{ itemCount }} {{ itemCount === 1 ? "result" : "results" }} found. Use the arrow keys to
					navigate.
				</template>
				<template v-else-if="haveQuery">No results found for "{{ query }}".</template>
			</template>
		</span>

		<div
			v-if="isOpen"
			ref="dropdown"
			:class="resolvedDropdownClasses"
			data-part="dropdown"
			data-test="combo-box-dropdown"
		>
			<loading-indicator v-show="loading" class="p-3" data-test="combo-box-loading">
				<slot name="loading">Loading…</slot>
			</loading-indicator>

			<ul
				v-show="!loading && haveItems"
				v-bind="listboxAttributes"
				class="max-h-64 overflow-y-auto py-1"
				data-test="combo-box-listbox"
			>
				<li
					v-for="entry in internalItems"
					:id="entry.id"
					:key="entry.id"
					:aria-selected="entry.id === activeId"
					:class="{ 'bg-grey-100 dark:bg-white/10': entry.id === activeId }"
					class="cursor-pointer px-3 py-2"
					role="option"
					data-part="option"
					data-test="combo-box-option"
					@mousedown.prevent="selectOption(entry.id)"
					@mouseenter="activeId = entry.id"
				>
					<slot v-bind="{ item: entry.item, highlighted: entry.id === activeId }">
						{{ entry.item }}
					</slot>
				</li>
			</ul>

			<div
				v-show="!loading && !haveItems && haveQuery"
				class="text-grey-500 px-3 py-2 text-sm dark:text-white/60"
				data-test="combo-box-no-results"
			>
				<slot name="no-results" v-bind="{ query }">No results found for "{{ query }}"</slot>
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * `combo-box` pairs a search input with a list of results, handling the
 * keyboard, ARIA, and open/close behaviour of the combobox interaction pattern
 * on top of the `useCombobox` composable.
 *
 * It deliberately does not filter. You pass the already-matched `items` — which
 * may come from a single source or several combined into a command menu — and
 * render each one through the default slot. Choosing a result emits it via the
 * `select` event.
 *
 * The `default` slot renders each result's content.
 * The `label` slot provides the input's label.
 * The `introduction` slot provides supporting text beneath the label.
 * The `no-results` slot replaces the empty-results message.
 * The `loading` slot replaces the loading message.
 */
import { computed, toRef, useTemplateRef, watch } from "vue";
import { arrayLength } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";
import { onClickOutside } from "@vueuse/core";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import { useCombobox, useFloatingPosition } from "@/composables";
import { cn } from "@/utilities/cn.js";

const props = defineProps({
	/**
	 * The results to display, already matched and ordered by the caller. Each
	 * item is rendered through the default slot and emitted as-is when chosen.
	 */
	items: {
		type: Array,
		default: () => [],
	},

	/**
	 * Whether results are currently loading. While loading, a message is shown
	 * in place of the results.
	 */
	loading: {
		type: Boolean,
		default: false,
	},

	/**
	 * Any ID to apply to the input. If an ID is not provided, one is generated
	 * at random. When providing an ID, please make sure that it is unique.
	 */
	id: {
		type: String,
		default: null,
	},

	/**
	 * Any placeholder to show in the input. This can hint at the kind of value
	 * the user is searching for.
	 */
	placeholder: {
		type: String,
		default: null,
	},

	/**
	 * Whether to open the results above or below the input. The list flips to
	 * the opposite side if it would clip the viewport edge.
	 */
	placement: {
		type: String,
		default: "below",
	},

	/**
	 * Whether to align the results to the start or end of the input. The list
	 * flips to the opposite side if it would clip the viewport edge.
	 */
	align: {
		type: String,
		default: "start",
	},

	/**
	 * Additional classes to apply to the results list, merged on top of its base
	 * styles. Any provided classes that conflict with base classes will override
	 * as necessary.
	 */
	dropdownClasses: {
		type: [String, Array, Object],
		default: null,
	},
});

const emit = defineEmits(["select"]);

// The current search query, exposed for two-way binding. Nothing is chosen
// until the user activates a result, so the query is the only model.
const query = defineModel({
	type: String,
	default: "",
});

// A stable prefix for option IDs, shared with the listbox, that keeps them from
// clashing with other IDs on the page.
const listboxId = nanoid();

// Each result paired with the ID used for its element and for keyboard
// navigation. The ID is derived from the result's position rather than the item
// itself, so callers can merge results from several sources without worrying
// about their IDs clashing.
const internalItems = computed(() =>
	props.items.map((item, index) => ({
		id: `${listboxId}-${index}`,
		item,
	})),
);

// The ordered option IDs handed to the combobox for keyboard navigation.
const optionIds = computed(() => internalItems.value.map((entry) => entry.id));

const {
	activeId,
	close: closeResults,
	handleKeydown,
	inputAttributes,
	isOpen,
	listboxAttributes,
	open: openResults,
	selectOption,
} = useCombobox({ listboxId, options: optionIds, onSelect: selectItem });

// A reference to the root element, so we can close the results when the user
// interacts elsewhere.
const containerElement = useTemplateRef("container");
// A reference to the input, so we can move focus to it on demand.
const inputComponent = useTemplateRef("input");
// A reference to the results list, used to measure and position it.
const dropdownElement = useTemplateRef("dropdown");

const {
	computedPlacement,
	computedAlign,
	isPositioning,
	placementClasses,
	handleOpen: handleFloatingOpen,
	handleClose: handleFloatingClose,
} = useFloatingPosition({
	triggerElement: containerElement,
	panelElement: dropdownElement,
	initialPlacement: toRef(props, "placement"),
	initialAlign: toRef(props, "align"),
});

// The number of results currently shown.
const itemCount = computed(() => arrayLength(internalItems.value));
// Whether there are any results to show.
const haveItems = computed(() => itemCount.value > 0);
// Whether the user has entered a search query.
const haveQuery = computed(() => isNonEmptyString(query.value));

// The full class list for the results list: base styling merged with the
// resolved position, alignment, and any caller overrides.
const resolvedDropdownClasses = computed(() =>
	cn(
		"absolute z-10 w-full overflow-hidden rounded-md border border-grey-200 bg-white shadow-lg dark:border-white/15 dark:bg-grey-800",
		placementClasses.value,
		computedPlacement.value === "above" ? "bottom-full" : "top-full",
		computedAlign.value === "end" ? "inset-e-0" : "inset-s-0",
		{ "opacity-0": isPositioning.value },
		props.dropdownClasses,
	),
);

// Open the results as the user types, and close them when the query is cleared.
watch(query, () => {
	if (haveQuery.value) {
		openResults();

		return;
	}

	closeResults();
});

// Measure and position the results whenever they open, and tear the positioning
// listeners down again when they close.
watch(isOpen, (currentlyOpen) => {
	if (currentlyOpen) {
		handleFloatingOpen();

		return;
	}

	handleFloatingClose();
});

onClickOutside(containerElement, closeResults);

/**
 * Handle a result being chosen, emitting the original item and clearing the
 * query ready for the next search.
 *
 * @param  {string}  id
 *     The chosen result's internal ID.
 */
function selectItem(id) {
	const entry = internalItems.value.find((entry) => entry.id === id);

	if (!entry) {
		return;
	}

	emit("select", entry.item);

	query.value = "";
}

/**
 * Re-open the results when the input regains focus, as long as there is a query
 * to show results for.
 */
function handleFocusin() {
	if (haveQuery.value) {
		openResults();
	}
}

/**
 * Close the results when focus leaves the component. Focus moving to another
 * element within the component — should one ever exist — keeps them open.
 *
 * @param  {FocusEvent}  event
 */
function handleFocusout(event) {
	if (containerElement.value?.contains(event.relatedTarget)) {
		return;
	}

	closeResults();
}

/**
 * Move focus to the input.
 */
function triggerFocus() {
	runComponentMethod(inputComponent.value, "triggerFocus");
}

defineExpose({
	triggerFocus,
});
</script>
