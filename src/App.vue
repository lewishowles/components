<template>
	<div class="flex justify-center pt-6">
		<select v-model="selectedPreview" class="block w-full max-w-sm appearance-none rounded-md bg-white px-3 py-2 text-grey-900 shadow-xs outline-hidden ring-1 ring-inset ring-grey-300 placeholder:text-grey-400 focus:ring-2 focus:ring-purple-800 dark:bg-white/20 dark:text-grey-50 dark:focus:ring-purple-400">
			<option v-for="option in previewOptions" :key="option" :value="option.value">
				{{ option.label }}
			</option>
		</select>
	</div>

	<component :is="selectedPreview" />
</template>

<script setup>
import { ref, watch } from "vue";

const selectedPreview = ref("user-avatars-preview");

const previewOptions = [
	{ label: "accordion-group", value: "accordion-group-preview" },
	{ label: "alert-message", value: "alert-message-preview" },
	{ label: "app-pagination", value: "app-pagination-preview" },
	{ label: "breadcrumb-list", value: "breadcrumb-list-preview" },
	{ label: "button-group", value: "button-group-preview" },
	{ label: "data-table", value: "data-table-preview" },
	{ label: "donut-chart", value: "donut-chart-preview" },
	{ label: "dropdown-menu", value: "dropdown-menu-preview" },
	{ label: "form-checkbox", value: "form-checkbox-preview" },
	{ label: "form-fieldset", value: "form-fieldset-preview" },
	{ label: "form-input", value: "form-input-preview" },
	{ label: "form-textarea", value: "form-textarea-preview" },
	{ label: "form-wrapper", value: "form-wrapper-preview" },
	{ label: "image-tag", value: "image-tag-preview" },
	{ label: "link-tag", value: "link-tag-preview" },
	{ label: "loading-indicator", value: "loading-indicator-preview" },
	{ label: "modal-dialog", value: "modal-dialog-preview" },
	{ label: "pill-badge", value: "pill-badge-preview" },
	{ label: "progress-bar", value: "progress-bar-preview" },
	{ label: "radio-group", value: "radio-group-preview" },
	{ label: "searchable-list", value: "searchable-list-preview" },
	{ label: "skeleton-loader", value: "skeleton-loader-preview" },
	{ label: "summary-details", value: "summary-details-preview" },
	{ label: "tab-group", value: "tab-group-preview" },
	{ label: "ui-button", value: "ui-button-preview" },
	{ label: "user-avatars", value: "user-avatars-preview" },
];

watch(selectedPreview, () => {
	document.title = selectedPreview.value;
}, { immediate: true });
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

.dark select {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff40' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
	background-position: right 0.5rem center;
	background-repeat: no-repeat;
	background-size: 1.5em 1.5em;
	padding-right: 2.5em;
}

select:focus {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b21a8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

.dark select:focus {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23c084fc' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}
</style>
