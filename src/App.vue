<template>
	<div class="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-6">
		<div class="flex px-2 text-sm">
			<form-select v-model="selectedPreview" v-bind="{ options: previewOptions }">
				Component
			</form-select>
		</div>

		<component :is="selectedPreview" class="flex-grow" />
	</div>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import { watch } from "vue";

const selectedPreview = useStorage("components:preview-component", "form-radio-group-preview");

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
	{ label: "form-checkbox-group", value: "form-checkbox-group-preview" },
	{ label: "form-date", value: "form-date-preview" },
	{ label: "form-fieldset", value: "form-fieldset-preview" },
	{ label: "form-input", value: "form-input-preview" },
	{ label: "form-input-group", value: "form-input-group-preview" },
	{ label: "form-radio-group", value: "form-radio-group-preview" },
	{ label: "form-select", value: "form-select-preview" },
	{ label: "form-textarea", value: "form-textarea-preview" },
	{ label: "form-wrapper", value: "form-wrapper-preview" },
	{ label: "icons", value: "icon-preview" },
	{ label: "image-tag", value: "image-tag-preview" },
	{ label: "link-tag", value: "link-tag-preview" },
	{ label: "loading-indicator", value: "loading-indicator-preview" },
	{ label: "modal-dialog", value: "modal-dialog-preview" },
	{ label: "pill-badge", value: "pill-badge-preview" },
	{ label: "progress-bar", value: "progress-bar-preview" },
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
