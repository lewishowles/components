<template>
	<!-- TODO: Implement routing, and navigation to each component's preview page for testing -->
	<ui-button-preview />
</template>

<script setup>
import UiButtonPreview from "./preview/ui-button-preview.vue";
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
