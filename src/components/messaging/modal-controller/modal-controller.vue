<template>
	<Teleport to="body">
		<base-modal
			v-for="modal in modals"
			:key="modal.id"
			:inert="modal.id !== currentModal?.id"
			@dialog:close="closeTopModal"
		>
			<component :is="modal.component" v-bind="{ ...modal.props, onClose: closeTopModal }" />
		</base-modal>
	</Teleport>
</template>

<script setup>
/**
 * Display modals as defined in `use-modal-dialog`. This uses our `base-modal`,
 * and expects a component as its content. We do this because modals in
 * `use-modal-dialog` are defined programmatically, and adding slot content is
 * more fiddly. This also promotes the use of individual components for modal
 * dialogs, keeping them self-contained.
 *
 * All modals in the stack stay in the DOM. Non-current modals receive the
 * `inert` attribute so they are visible but not interactive, which preserves
 * focus context when a stacked modal closes.
 */
import { computed } from "vue";
import { isNonEmptyArray, lastDefined } from "@lewishowles/helpers/array";
import useModalDialog from "@/composables/use-modal-dialog/use-modal-dialog";

const { modals, closeTopModal } = useModalDialog();

// The topmost modal — the one the user is currently interacting with.
const currentModal = computed(() => {
	if (!isNonEmptyArray(modals.value)) {
		return null;
	}

	return lastDefined(modals.value);
});
</script>
