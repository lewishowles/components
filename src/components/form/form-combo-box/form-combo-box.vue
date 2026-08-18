<template>
	<div
		ref="container"
		class="relative"
		:class="{ 'z-10': isOpen }"
		data-component="form-combo-box"
		data-test="form-combo-box"
	>
		<div data-part="input" data-test="form-combo-box-input">
			<form-input
				ref="input"
				v-model="query"
				v-bind="{ id, placeholder, inputAttributes }"
				@update:model-value="handleInput"
			>
				<slot name="label" />

				<template #introduction>
					<slot name="introduction" />
				</template>
			</form-input>
		</div>

		<span aria-live="polite" class="sr-only" data-test="form-combo-box-announcement">
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
			data-test="form-combo-box-dropdown"
		>
			<loading-indicator v-show="loading" class="p-3" data-test="form-combo-box-loading">
				<slot name="loading">Loading…</slot>
			</loading-indicator>

			<ul
				v-show="!loading && haveItems"
				v-bind="listboxAttributes"
				class="max-h-64 overflow-y-auto py-1"
				data-test="form-combo-box-listbox"
			>
				<li
					v-for="entry in internalItems"
					v-bind="{
						id: entry.id,
						key: entry.id,
						'aria-selected': entry.id === activeId,
					}"
					:class="{ 'bg-surface-sunken': entry.id === activeId }"
					class="cursor-pointer rounded-md px-3 py-2"
					role="option"
					data-part="option"
					data-test="form-combo-box-option"
					@mousedown.prevent="selectOption(entry.id)"
					@mouseenter="activeId = entry.id"
				>
					<slot v-bind="{ option: entry.option, highlighted: entry.id === activeId }">
						{{ entry.option }}
					</slot>
				</li>
			</ul>

			<div
				v-show="!loading && !haveItems && haveQuery"
				class="text-content-muted p-3 text-sm"
				data-test="form-combo-box-no-results"
			>
				<slot name="no-results" v-bind="{ query }">No results found for "{{ query }}"</slot>
			</div>
		</div>
	</div>
</template>

<script setup>
import { arrayLength } from "@lewishowles/helpers/array";
import { cn } from "@/utilities/cn.js";
import { computed, ref, toRef, useTemplateRef, watch } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";
import { onClickOutside } from "@vueuse/core";
import { useCombobox, useFloatingPosition } from "@/composables";
import useOptions from "@/components/form/composables/use-options/use-options";

/**
 * `form-combo-box` pairs a search input with a list of results, handling the
 * keyboard, ARIA, and open/close behaviour of the combobox interaction pattern
 * on top of the `useCombobox` composable.
 *
 * Only when a result is selected does `form-combo-box` take its value.
 *
 * The `default` slot renders each result's content.
 * The `label` slot provides the input's label.
 * The `introduction` slot provides supporting text beneath the label.
 * The `no-results` slot replaces the empty-results message.
 * The `loading` slot replaces the loading message.
 */
const props = defineProps({
	/**
	 * The options for this combo-box. Options can be a string, used for both
	 * the label and value, an object containing a "label" and "value", or an
	 * object in conjunction with the `labelKey` and `valueKey` props.
	 */
	options: {
		type: [Array, Object],
		default: () => [],
	},

	/**
	 * The key needed to find each option's label within its object. If an
	 * individual option is a string or number, this is ignored.
	 */
	labelKey: {
		type: String,
		default: "label",
	},

	/**
	 * The key needed to find each option's value within its object. If an
	 * individual option is a string or number, this is ignored.
	 */
	valueKey: {
		type: String,
		default: "value",
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

// The selected item.
const model = defineModel({
	type: [String, Number],
});

// The current text box query.
const query = ref("");
// The label for the selected value, used to tell whether the query has since
// changed.
const displayedLabel = ref("");

// Standardised options.
const { options: internalOptions } = useOptions(toRef(props, "options"), {
	labelKey: props.labelKey,
	valueKey: props.valueKey,
});

// A stable prefix for option IDs, shared with the listbox, that keeps them from
// clashing with other IDs on the page.
const listboxId = nanoid();

// Each result paired with the ID used for its element and for keyboard
// navigation, together with its original option for richer slot content. The
// ID is derived from the result's position rather than the item itself, so
// callers can merge results from several sources without worrying about their
// IDs clashing.
const internalItems = computed(() =>
	internalOptions.value.map((option, index) => ({
		id: `${listboxId}-${index}`,
		option,
		originalOption: option.originalOption,
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

// The currently selected result, if any.
const selectedItem = computed(() =>
	internalItems.value.find((entry) => entry.option.value === model.value),
);

// The full class list for the results list: base styling merged with the
// resolved position, alignment, and any caller overrides.
const resolvedDropdownClasses = computed(() =>
	cn(
		"absolute z-10 w-full overflow-hidden rounded-md border border-border bg-surface-elevated shadow-lg",
		placementClasses.value,
		computedPlacement.value === "above" ? "bottom-full" : "top-full",
		computedAlign.value === "end" ? "inset-e-0" : "inset-s-0",
		{ "opacity-0": isPositioning.value },
		props.dropdownClasses,
	),
);

// Measure and position the results whenever they open, and tear the positioning
// listeners down again when they close.
watch(isOpen, (currentlyOpen) => {
	if (currentlyOpen) {
		handleFloatingOpen();

		return;
	}

	handleFloatingClose();
});

// Sync the displayed query with the model's label whenever the selected value
// changes, including on initial mount and when the model is set externally.
watch(
	model,
	() => {
		const previousDisplayedLabel = displayedLabel.value;
		const selectedEntry = selectedItem.value;

		if (selectedEntry) {
			displayedLabel.value = String(selectedEntry.option.label);
			query.value = displayedLabel.value;

			return;
		}

		displayedLabel.value = "";

		if (query.value === previousDisplayedLabel) {
			query.value = "";
		}
	},
	{ immediate: true },
);

// Refresh the displayed label when options change, in case the selected
// option's label changed too. A value not yet present in the new options is
// left as-is rather than cleared.
watch(internalItems, () => {
	const selectedEntry = selectedItem.value;

	if (!selectedEntry) {
		return;
	}

	displayedLabel.value = String(selectedEntry.option.label);
	query.value = displayedLabel.value;
});

// Clear the selected value once the visible query no longer matches its
// label, since editing or clearing the text means the previous selection no
// longer represents what's shown.
watch(query, (value) => {
	if (value === displayedLabel.value) {
		return;
	}

	displayedLabel.value = "";

	if (model.value !== null && model.value !== undefined) {
		model.value = null;
	}
});

onClickOutside(containerElement, closeResults);

/**
 * Handle a result being chosen: sets the model to its value and syncs the
 * displayed label and query to match.
 *
 * @param  {string}  id
 *     The chosen result's internal ID.
 */
function selectItem(id) {
	const entry = internalItems.value.find((entry) => entry.id === id);

	if (!entry) {
		return;
	}

	displayedLabel.value = String(entry.option.label);
	model.value = entry.option.value;
	query.value = displayedLabel.value;

	closeResults();
}

/**
 * When the value of the search box changes by user input, determine whether to
 * open or close the results.
 */
function handleInput(value) {
	if (isNonEmptyString(value)) {
		openResults();

		return;
	}

	closeResults();
}
</script>
