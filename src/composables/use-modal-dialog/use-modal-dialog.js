import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { readonly, ref } from "vue";

const modals = ref([]);

let modalId = 0;

/**
 * `useModalDialog` allows for components to request a modal dialog be
 * displayed. The display of these dialogs should be controlled by
 * `modal-dialog-controller`, which will display the most recently requested
 * dialog.
 */
export default function useModalDialog() {
	/**
	 * Add a modal to the stack, to be displayed by `modal-dialog-controller`.
	 *
	 * @param  {object}  component
	 *     A reference to the component to be displayed as the content of the
	 *     modal dialog.
	 * @param  {object}  props
	 *     Any props to pass to the component used in this dialog.
	 */
	function openModal(component, props = {}) {
		if (!component) {
			return;
		}

		modals.value.push({ id: ++modalId, component, props });
	}

	/**
	 * Close the most recently shown modal dialog by removing it from the modals
	 * array, meaning it will no longer be displayed.
	 */
	function closeTopModal() {
		if (!isNonEmptyArray(modals.value)) {
			return;
		}

		modals.value.pop();
	}

	/**
	 * Remove all modals. Should not really be used unless absolutely necessary
	 * as it will remove any modal created, even from other components.
	 */
	function _clearModals() {
		modals.value = [];
	}

	return {
		modals: readonly(modals),
		openModal,
		closeTopModal,
		_clearModals,
	};
}
