<template>
	<div
		:class="scrollIndicatorClasses"
		data-part="scroll-indicators"
		data-test="data-table-scroll-indicators"
	>
		<div
			ref="tableScrollWrapper"
			class="relative overflow-x-auto"
			data-part="scroll-region"
			data-test="data-table-scroll-region"
			v-bind="getScrollRegionAttributes()"
		>
			<table v-show="haveTableContent" class="w-full" data-test="data-table-table">
				<caption
					v-if="hasCaption() || (enableSort && sortedColumn)"
					:id="captionId"
					class="text-start italic"
					:class="{ 'mb-2': hasCaption() }"
				>
					<slot name="caption" />

					<span v-if="enableSort && sortedColumn" class="sr-only">
						<slot
							name="sorted-hint"
							v-bind="{
								sortedColumn: getColumnLabel(sortedColumn),
								ascending: isAscending,
							}"
						>
							Sorted by {{ getColumnLabel(sortedColumn) }}
							<template v-if="isAscending">ascending</template>
							<template v-else>descending</template>
						</slot>
					</span>
				</caption>

				<thead>
					<tr class="border-border-strong border-b">
						<th v-if="enableSelection" scope="col" class="w-px px-4">
							<form-checkbox
								v-bind="{
									displayLabel: false,
									indeterminate: selectAllIndeterminate,
									showOptionalIndicator: false,
								}"
								v-model="selectAllRows"
								class="shrink"
								data-test="data-table-select-all-rows"
								@change="toggleAllRows"
							>
								<slot name="select-all-rows-label">Select all rows</slot>
							</form-checkbox>
						</th>
						<th
							v-for="(column, columnKey) in visibleColumnDefinitions"
							:key="columnKey"
							v-bind="{ 'aria-sort': getColumnSortDirection(columnKey) }"
							scope="col"
							class="py-4"
							:class="[
								{
									'ps-3': !isColumnSortable(column) && !column.first,
									'pe-3': !isColumnSortable(column) && !column.last,
									'text-start': column.align !== 'right',
									'text-end': column.align === 'right',
								},
								!isColumnSortable(column) ? getHeadingClasses(column) : null,
							]"
							data-test="data-table-heading"
						>
							<ui-button
								v-if="isColumnSortable(column)"
								v-bind="{ iconEnd: getSortIcon(columnKey) }"
								class="hocus:border-primary hocus:bg-surface-sunken -mt-4 -mb-4.25 w-full border-b border-transparent py-4"
								:class="[
									{
										'ps-3': !column.first,
										'pe-3': !column.last,
										'justify-start': column.align !== 'right',
										'justify-end': column.align === 'right',
									},
									getHeadingClasses(column),
								]"
								data-test="data-table-sort"
								@click="sortColumn(columnKey)"
							>
								<slot
									:name="`${columnKey}_heading`"
									v-bind="{ key: columnKey, label: column.label }"
								>
									{{ column.label }}
								</slot>

								<span class="sr-only">
									<slot
										name="sort-instruction"
										v-bind="{
											label: column.label,
											sorted: columnKey === sortedColumn,
											direction: getColumnSortDirection(columnKey),
										}"
									>
										{{ getSortInstruction(columnKey) }}
									</slot>
								</span>
							</ui-button>

							<slot
								v-else
								:name="`${columnKey}_heading`"
								v-bind="{ key: columnKey, label: column.label }"
							>
								<!-- The auto-injected actions column hides its heading text from view. An #actions_heading slot replaces that text and shows it visibly. -->
								<span v-if="column.visuallyHiddenHeading" class="sr-only">
									{{ column.label }}
								</span>
								<template v-else>{{ column.label }}</template>
							</slot>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="isLoading" data-test="data-table-loading-row">
						<td :colspan="stateRowColumnCount" class="py-6 text-center">
							<loading-indicator large data-test="data-table-loading">
								<slot name="loading-label">Loading data</slot>
							</loading-indicator>
						</td>
					</tr>

					<tr v-else-if="haveError" data-test="data-table-error-row">
						<td :colspan="stateRowColumnCount" class="py-6">
							<alert-message type="error" data-test="data-table-error">
								<slot name="error" v-bind="{ error }">{{ errorMessage }}</slot>
							</alert-message>
						</td>
					</tr>

					<template v-else>
						<tr
							v-for="(row, rowIndex) in paginatedRows"
							:key="row.configuration.id"
							class="border-border hover:bg-surface-subtle border-b transition-colors last:border-b-0"
							data-test="data-table-row"
						>
							<td v-if="enableSelection" class="px-4">
								<form-checkbox
									v-bind="{
										displayLabel: false,
										inputAttributes: { value: getRowId(row) },
										showOptionalIndicator: false,
									}"
									v-model="selectedRowIds"
									class="shrink"
									data-test="data-table-select-row"
								>
									<slot
										name="select-row-label"
										v-bind="{ row: getRawRow(row), rowNumber: rowIndex + 1 }"
									>
										Select row {{ rowIndex + 1 }}
									</slot>
								</form-checkbox>
							</td>
							<component
								:is="column.primary ? 'th' : 'td'"
								v-for="(column, columnKey) in visibleColumnDefinitions"
								:key="columnKey"
								:scope="column.primary ? 'row' : null"
								:class="[
									{
										'ps-3': !column.first,
										'pe-3': !column.last,
										'text-content-strong font-semibold': column.primary,
										'text-start': column.align !== 'right',
										'text-end': column.align === 'right',
										'tabular-nums': column.tabularNums,
									},
									getCellClasses(column),
								]"
								data-test="data-table-cell"
							>
								<slot
									:name="columnKey"
									v-bind="{ cell: getRowContent(row, columnKey), row: getRawRow(row) }"
								>
									{{ getRowContent(row, columnKey) }}
								</slot>
							</component>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { computed, inject, ref, useId, useSlots, watchEffect } from "vue";
import { useResizeObserver, useScroll } from "@vueuse/core";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import {
	getRawRow,
	getRowContent,
	getRowId,
} from "@/components/content/data-table/utilities/row.js";
import { sortDirections } from "@/components/content/data-table/composables/use-table-sort/use-table-sort.js";

// The table's state and actions, shared by its parent with the other fragments.
const {
	visibleColumnDefinitions,
	paginatedRows,
	haveTableContent,
	enableSort,
	enableSelection,
	sortedColumn,
	isAscending,
	isLoading,
	haveError,
	error,
	errorMessage,
	overflowLabel,
	selectAllIndeterminate,
	stateRowColumnCount,
	getColumnLabel,
	getColumnSortDirection,
	getHeadingClasses,
	getCellClasses,
	getSortIcon,
	sortColumn,
	toggleAllRows,
	selectAllRows,
	selectedRowIds,
} = inject("data-table");

// The user's slots, used to check whether a caption was provided.
const slots = useSlots();
// Whether an explicit label is available for an overflowing table.
const haveOverflowLabel = computed(() => isNonEmptyString(overflowLabel.value));
// A reference to the horizontal scroll region.
const tableScrollWrapper = ref(null);
// Whether the table needs horizontal scrolling.
const isOverflowing = ref(false);
// The caption ID used to label the horizontal scroll region.
const captionId = useId();
// The current horizontal scroll edges for the visible overflow indicators.
const { arrivedState, measure } = useScroll(tableScrollWrapper, { observe: true });

// Classes that expose which table edges have hidden content beyond them.
const scrollIndicatorClasses = computed(() => ({
	"show-left": isOverflowing.value && !arrivedState.left,
	"show-right": isOverflowing.value && !arrivedState.right,
}));

// Recheck overflow when the scroll region resizes, since column content and
// the viewport both change whether the table fits.
useResizeObserver(tableScrollWrapper, () => {
	isOverflowing.value =
		tableScrollWrapper.value?.scrollWidth > tableScrollWrapper.value?.clientWidth;
	measure();
});

// Warn during development when an overflowing table has no accessible name for
// its scroll region. This reruns when overflow or the overflow label changes.
watchEffect(() => {
	if (!import.meta.env.DEV || !isOverflowing.value || hasCaption() || haveOverflowLabel.value) {
		return;
	}

	console.warn(
		"[data-table] An overflowing table needs a caption or `overflowLabel` to label its scroll region.",
	);
});

/**
 * Whether the user has provided a caption. The table checks this on every
 * render, because a caption added or removed after the table first appears
 * changes how the caption and the scroll region are labelled.
 */
function hasCaption() {
	return isNonEmptySlot(slots.caption);
}

/**
 * Return the focus and naming attributes for the scroll region. An overflowing
 * table can be focused so keyboard users can scroll it, and becomes a named
 * region when a caption or overflow label is available. Called during each
 * render, because the caption slot can change after the table first appears.
 */
function getScrollRegionAttributes() {
	if (!isOverflowing.value) {
		return { tabindex: -1 };
	}

	if (hasCaption()) {
		return { tabindex: 0, role: "region", "aria-labelledby": captionId };
	}

	if (haveOverflowLabel.value) {
		return { tabindex: 0, role: "region", "aria-label": overflowLabel.value };
	}

	// A region with no name would be announced without a label, so the table
	// stays focusable without becoming a region.
	return { tabindex: 0 };
}

/**
 * Whether a column shows a sort button. Sorting must be enabled for the table
 * and for the column itself.
 *
 * @param  {object}  column
 *     The column definition to check.
 */
function isColumnSortable(column) {
	return enableSort.value && column.sortable;
}

/**
 * Describe the current sort and the next action for a column's sort button.
 * The sort-instruction slot can replace this text for translation.
 *
 * @param  {string}  columnKey
 *     The key of the column to describe.
 */
function getSortInstruction(columnKey) {
	const direction = getColumnSortDirection(columnKey);

	if (direction === null) {
		return "(sortable: activate to sort ascending)";
	}

	if (direction === sortDirections.ASCENDING) {
		return "(sorted ascending: activate to sort descending)";
	}

	return "(sorted descending: activate to sort ascending)";
}
</script>
