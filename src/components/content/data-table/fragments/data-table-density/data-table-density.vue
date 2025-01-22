<template>
	<div data-test="data-table-density">
		<template v-for="({ label, value }) in tableDensityOptions" :key="value">
			<dropdown-menu-button v-bind="{ iconStart: `icon-density-${value}`, selected: tableDensity === value }" :data-test="`data-table-density-${value}`" @click="setTableDensity(value)">
				<slot :name="`display-option-${value}-label`">
					{{ label }}
				</slot>
			</dropdown-menu-button>
		</template>
	</div>
</template>

<script setup>
import { inject, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useStorage } from "@vueuse/core";

const { tableName, haveTableName, updateTableDensityOptions } = inject("data-table");
// The user selected density. We know we will have a table name because this
// component isn't activated without it, but we check it just in case.
const userDensity = haveTableName.value && useStorage(`data-table:${tableName.value}:density`, "relaxed");

// Our user-selected table density.
const tableDensity = defineModel({
	type: String,
});

// Available table densities.
const tableDensityOptions = ref([
	{ label: "Compact", value: "compact" },
	{ label: "Standard", value: "standard" },
	{ label: "Relaxed", value: "relaxed" },
]);

// Notify the parent of the available densities, which means it can make the
// appropriate slots available for users.
updateTableDensityOptions(tableDensityOptions.value.map(density => density.value));

// Initialise our model value for table density based on our determined initial
// value.
if (haveTableName.value) {
	tableDensity.value = userDensity.value;
};

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

	const isValidDensity = tableDensityOptions.value.map(option => option.value).includes(density);

	if (!isValidDensity) {
		return;
	}

	userDensity.value = density;
	tableDensity.value = density;
}
</script>
