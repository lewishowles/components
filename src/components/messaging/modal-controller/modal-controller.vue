<template>
	<Teleport to="body">
		<KeepAlive>
			<base-modal
				v-if="currentModal"
				:key="currentModal.id"
				@dialog:close="closeTopModal"
			>
				<component
					:is="currentModal.component"
					v-bind="currentModal.props"
				/>
			</base-modal>
		</KeepAlive>
	</Teleport>
</template>

<script setup>
/**
 * Display modals as defined in `use-modal-dialog`. This uses our `base-modal`,
 * and expects a component as its content. We do this because modals in
 * `use-modal-dialog` are defined programmatically, and adding slot content is
 * more fiddly. This also promotes the use of individual components for modal
 * dialogs, keeping them self-contained.
 */
import { computed } from "vue";
import { isNonEmptyArray, lastDefined } from "@lewishowles/helpers/array";
import useModalDialog from "@/composables/use-modal-dialog/use-modal-dialog";

const { modals, closeTopModal } = useModalDialog();

// The top, or current modal, to display to the user. If no modals are defined,
// there will be no current modal.
const currentModal = computed(() => {
	if (!isNonEmptyArray(modals.value)) {
		return null;
	}

	return lastDefined(modals.value);
});
</script>
