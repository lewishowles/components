<template>
	<div class="flex justify-center pt-6">
		<form-select v-model="selectedPreview" v-bind="{ options: previewOptions }">
			Select component to preview
		</form-select>
	</div>

	<component :is="selectedPreview" />
</template>

<script setup>
import { ref, watch } from "vue";

const selectedPreview = ref("form-date-preview");

const previewOptions = [
	{ label: "form-date", value: "form-date-preview" },
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
	{ label: "form-select", value: "form-select-preview" },
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
</style>
