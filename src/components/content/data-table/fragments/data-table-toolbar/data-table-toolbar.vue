<template>
	<!--
		Grid tracks size the slotted controls from the toolbar's own width. A slotted control that
		establishes a container query reports no intrinsic width, so a content-sized track (flex, or
		auto/max-content columns) collapses it to nothing.
	-->
	<div
		v-if="
			enableSearch || showUserConfiguration || $slots['post-search'] || $slots['pre-configuration']
		"
		class="grid gap-4 lg:items-end"
		:class="$slots['pre-configuration'] ? 'lg:grid-cols-2' : 'lg:grid-cols-[minmax(0,1fr)_auto]'"
		data-test="data-table-toolbar"
	>
		<div
			v-if="enableSearch || $slots['post-search']"
			class="grid items-end gap-4"
			:class="
				enableSearch && $slots['post-search']
					? 'lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]'
					: 'lg:auto-cols-fr lg:grid-flow-col'
			"
		>
			<data-table-search v-if="enableSearch" ref="searchComponent" v-model="searchQuery">
				<template #search-label>
					<slot name="search-label" />
				</template>
				<template #search-introduction>
					<slot name="search-introduction" />
				</template>
				<template #search-help>
					<slot name="search-help" />
				</template>
				<template #reset-search-label>
					<slot name="reset-search-label" />
				</template>
			</data-table-search>

			<div v-if="$slots['post-search']">
				<slot name="post-search" />
			</div>
		</div>

		<div
			v-if="showUserConfiguration || $slots['pre-configuration']"
			class="grid items-end gap-4 lg:col-start-2 lg:auto-cols-fr lg:grid-flow-col"
		>
			<div v-if="$slots['pre-configuration']">
				<slot name="pre-configuration" />
			</div>

			<floating-details
				v-if="showUserConfiguration"
				align="end"
				details-classes="min-w-3xs py-2 rounded-lg border"
				class="lg:justify-self-end"
				data-test="data-table-display-options"
			>
				<template #summary>
					<slot name="configure-label">Configure</slot>
				</template>

				<template v-if="haveTableName">
					<h4 class="text-content-strong my-2 px-4 font-semibold">
						<slot name="display-options-label">Display options</slot>
					</h4>

					<data-table-density v-model="density">
						<template
							v-for="key in tableDensityOptions"
							#[`display-option-${key}-label`]
							:key="key"
						>
							<slot :name="`display-option-${key}-label`" />
						</template>
					</data-table-density>

					<h4 class="text-content-strong my-2 px-4 font-semibold">
						<slot name="column-visibility-label">Columns</slot>
					</h4>

					<data-table-columns v-model="columnVisibility" />
				</template>
			</floating-details>
		</div>
	</div>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { callComponentMethod } from "@lewishowles/helpers/vue";

import DataTableColumns from "../data-table-columns/data-table-columns.vue";
import DataTableDensity from "../data-table-density/data-table-density.vue";
import DataTableSearch from "../data-table-search/data-table-search.vue";

const { haveTableName } = inject("data-table", {});

defineProps({
	/**
	 * Whether the table search is enabled.
	 */
	enableSearch: {
		type: Boolean,
		default: true,
	},

	/**
	 * The available density option keys, used to forward their label slots.
	 */
	tableDensityOptions: {
		type: Array,
		default: () => [],
	},
});

// The current search query.
const searchQuery = defineModel("searchQuery", { type: String });
// The current table density.
const density = defineModel("density", { type: String });
// The user-selected column visibility map.
const columnVisibility = defineModel("columnVisibility", { type: Object });

// A reference to the search sub-component, allowing the table to focus it.
const searchComponent = ref(null);
// Whether to show the display options, which require a table name.
const showUserConfiguration = computed(() => Boolean(haveTableName?.value));

/**
 * Focus the search input via the underlying search component.
 */
function triggerSearchFocus() {
	callComponentMethod(searchComponent.value, "triggerFocus");
}

defineExpose({
	triggerSearchFocus,
});
</script>
