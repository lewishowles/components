<template>
	<div>
		<combo-box
			:items="items"
			:loading="loading"
			:placeholder="placeholder"
			:dropdown-classes="dropdownClasses"
			@select="handleSelect"
		>
			<template #label>Search crew</template>

			<template #default="{ item }">
				<span data-test="combo-box-demo-item">{{ item.name }}</span>
			</template>
		</combo-box>

		<div data-test="selected-item" :data-selected="selectedItem?.id ?? ''"></div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import ComboBox from "./combo-box.vue";

const props = defineProps({
	items: {
		type: Array,
		default: () => [
			{ id: "1", name: "Picard" },
			{ id: "2", name: "Riker" },
			{ id: "3", name: "Data" },
		],
	},

	loading: {
		type: Boolean,
		default: false,
	},

	placeholder: {
		type: String,
		default: "e.g. Picard",
	},

	dropdownClasses: {
		type: String,
		default: null,
	},
});

const selectedItem = ref(null);

function handleSelect(item) {
	selectedItem.value = item;
}
</script>
