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
import { computed, inject, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useStorage } from "@vueuse/core";

const props = defineProps({
	/**
	 * A unique name for this table. This will be used to store the user's
	 * preferences for how dense the table is. Without a name, this option will
	 * not be available. The name will be used directly in `localStorage`,
	 * prefixed with `data-table:`, so should be safe for users.
	 */
	name: {
		type: String,
		default: null,
	},
});

const { setTableDensityOptions } = inject("data-table");
// Whether a name has been provided for this table.
const haveTableName = computed(() => isNonEmptyString(props.name));
// The user selected density. We know we will have a table name because this
// component isn't activated without it, but just in case we check anyway.
const userDensity = haveTableName.value && useStorage(`data-table:${props.name}:density`, "relaxed");

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
setTableDensityOptions(tableDensityOptions.value.map(density => density.value));

// Initialise our user value for table density, which itself defaults to
// "relaxed".
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
