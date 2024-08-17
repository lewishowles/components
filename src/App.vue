<template>
	<div class="flex justify-center pt-6">
		<select v-model="selectedPreview" class="text-gray-900 block w-full max-w-sm appearance-none rounded-md bg-white px-3 py-2 shadow-sm outline-none ring-1 ring-inset ring-grey-300 placeholder:text-grey-400 focus:ring-2 focus:ring-purple-800">
			<option v-for="option in previewOptions" :key="option" :value="option.value">
				{{ option.label }}
			</option>
		</select>
	</div>

	<component :is="selectedPreview" />
</template>

<script setup>
import { ref } from "vue";

const selectedPreview = ref("form-preview");

const previewOptions = [
	{ label: "form", value: "form-preview" },
	{ label: "form-input", value: "form-input-preview" },
	{ label: "link-tag", value: "link-tag-preview" },
	{ label: "pill-badge", value: "pill-badge-preview" },
	{ label: "radio-group", value: "radio-group-preview" },
	{ label: "ui-button", value: "ui-button-preview" },
];
</script>

<style>
.guides-horizontal, .guides-vertical {
	position: relative;

	&::before, &::after {
		background: theme("colors.grey.300");
		content: "";
		position: absolute;
	}
}

.guides-horizontal--faded, .guides-vertical--faded {
	&::before, &::after {
		background: theme("colors.purple.200");
	}
}

.guides-horizontal {
	&::before, &::after {
		height: 1px;
		right: -1rem;
		left: -1rem;
	}

	&::before {
		top: 0;
	}

	&::after {
		bottom: 0;
	}
}

.guides-vertical {
	&::before, &::after {
		width: 1px;
		top: -1rem;
		bottom: -1rem;
	}

	&::before {
		left: 0;
	}

	&::after {
		right: 0;
	}
}

select {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
	background-position: right 0.5rem center;
	background-repeat: no-repeat;
	background-size: 1.5em 1.5em;
	padding-right: 2.5em;
}

select:focus {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b21a8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}
</style>
