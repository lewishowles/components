<template>
	<div data-test="data-table-density">
		<template v-for="{ label, value } in tableDensityOptions" :key="value">
			<ui-button
				v-bind="{ iconStart: `icon-density-${value}` }"
				class="hocus:border-current hocus:bg-surface-subtle hocus:text-primary w-full justify-start border-s-2 px-4 py-2"
				:class="{
					'bg-surface-subtle text-primary border-current': tableDensity === value,
					'border-transparent': tableDensity !== value,
				}"
				:data-test="`data-table-density-${value}`"
				@click="setTableDensity(value)"
			>
				<slot :name="`display-option-${value}-label`">
					{{ label }}
				</slot>
			</ui-button>
		</template>
	</div>
</template>

<script setup>
import { inject, ref, toValue, watch } from "vue";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useStorage } from "@vueuse/core";

// Our user-selected table density.
const tableDensity = defineModel({
	type: String,
});

const { tableName: providedTableName, updateTableDensityOptions } = inject("data-table", {});

// The user's stored density preference for the current table. Each useStorage
// ref is tied to one key, so a name change creates a new one and this variable
// must hold whichever one is in use.
let userDensity = ref("relaxed");

// Switch to the matching stored density preference whenever the table name
// changes.
watch(
	() => toValue(providedTableName),
	(currentName) => {
		if (!isNonEmptyString(currentName)) {
			userDensity = ref("relaxed");

			return;
		}

		userDensity = useStorage(`data-table:${currentName}:density`, "relaxed");
		tableDensity.value = userDensity.value;
	},
	{ immediate: true },
);

// Available table densities.
const tableDensityOptions = ref([
	{ label: "Compact", value: "compact" },
	{ label: "Standard", value: "standard" },
	{ label: "Relaxed", value: "relaxed" },
]);

// Notify the parent of the available densities, which means it can make the
// appropriate slots available for users.
if (isFunction(updateTableDensityOptions)) {
	updateTableDensityOptions(tableDensityOptions.value.map((density) => density.value));
}

/**
 * Set the table density based on user choice.
 *
 * @param  {string}  density
 *     The density setting.
 */
function setTableDensity(density) {
	if (!isNonEmptyString(density)) {
		return;
	}

	const isValidDensity = tableDensityOptions.value.map((option) => option.value).includes(density);

	if (!isValidDensity) {
		return;
	}

	userDensity.value = density;
	tableDensity.value = density;
}
</script>
