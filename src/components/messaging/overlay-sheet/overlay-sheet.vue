<template>
	<dialog
		ref="dialog"
		:class="rootClasses"
		v-bind="attrsWithoutClass"
		aria-modal="true"
		:aria-label="props.label"
		data-part="sheet"
		@cancel="handleCancel"
		@close="handleClose"
	>
		<div class="mb-4 flex justify-end">
			<ui-button
				class="button--ghost"
				icon-start="icon-cross"
				icon-only
				data-part="close-button"
				data-test="overlay-sheet-close"
				@click="dismissSheet"
			>
				<slot name="close-dialog-label">Close dialog</slot>
			</ui-button>
		</div>
	</dialog>

	<!-- Keep the slot in place until the dialog target is mounted. -->
	<teleport
		v-bind="{
			disabled: !props.isSheet || !dialog,
			to: dialog || 'body',
		}"
	>
		<slot />
	</teleport>
</template>

<script setup>
import { cn } from "@/utilities/cn.js";
import { computed, nextTick, useAttrs, useTemplateRef, watch } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
	/**
	 * Whether the owning component considers the surface open.
	 */
	isOpen: {
		type: Boolean,
		required: true,
	},

	/**
	 * Whether the surface should use the native dialog sheet presentation.
	 */
	isSheet: {
		type: Boolean,
		required: true,
	},

	/**
	 * The accessible name for the sheet dialog.
	 */
	label: {
		type: String,
		required: true,
	},

	/**
	 * Whether Escape should dismiss the sheet.
	 */
	closeWithEscape: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["dismiss"]);
const attrs = useAttrs();
const dialog = useTemplateRef("dialog");

// Whether the next native dialog close was initiated programmatically, avoiding
// multiple handlers.
let isProgrammaticClose = false;

// Root dialog classes, including the repeated sheet entrance animation.
const rootClasses = computed(() =>
	cn({ "animate-fade-in-up": props.isOpen && props.isSheet }, attrs.class),
);

// Fallthrough attributes excluding the separately merged root class.
const attrsWithoutClass = computed(() => {
	const { class: _class, ...rest } = attrs;

	return rest;
});

/**
 * Synchronise the native dialog with the owning component's requested state.
 */
watch(
	() => props.isOpen && props.isSheet,
	async () => {
		await nextTick();

		if (props.isOpen && props.isSheet) {
			openDialog();

			return;
		}

		closeDialog();
	},
	{ immediate: true },
);

/**
 * Open the native dialog when the current viewport uses sheets.
 */
function openDialog() {
	if (!props.isOpen || !props.isSheet || !dialog.value || dialog.value.open) {
		return;
	}

	dialog.value.showModal();
}

/**
 * Close the native dialog without changing the requested open state.
 */
function closeDialog() {
	if (!dialog.value?.open) {
		return;
	}

	isProgrammaticClose = true;

	try {
		dialog.value.close();
	} catch (error) {
		isProgrammaticClose = false;

		throw error;
	}
}

/**
 * Handle Escape while preserving the closeWithEscape contract.
 *
 * @param  {Event}  event
 *     The native dialog cancel event.
 */
function handleCancel(event) {
	event.preventDefault();

	if (props.closeWithEscape) {
		dismissSheet();
	}
}

/**
 * Request dismissal from an explicit sheet action.
 */
function dismissSheet() {
	emit("dismiss");
}

/**
 * Synchronise a native close with the owning component.
 */
function handleClose() {
	if (isProgrammaticClose) {
		isProgrammaticClose = false;

		return;
	}

	if (!props.isOpen) {
		return;
	}

	emit("dismiss");
}
</script>
