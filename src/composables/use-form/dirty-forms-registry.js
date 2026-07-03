import { ref } from "vue";

// Count of currently-dirty forms across the app, incremented/decremented by
// each useForm instance that opts into unsaved-changes tracking. Module-level
// (like use-modal-dialog's `modals` stack) so a single global guard can check
// "is anything dirty" without every form needing to register its own
// navigation guard.
const dirtyFormCount = ref(0);

/**
 * Mark a form as dirty, contributing to the shared count.
 */
export function registerDirtyForm() {
	dirtyFormCount.value++;
}

/**
 * Mark a form as no longer dirty, removing its contribution to the shared
 * count.
 */
export function unregisterDirtyForm() {
	dirtyFormCount.value = Math.max(0, dirtyFormCount.value - 1);
}

/**
 * Whether any registered form is currently dirty.
 *
 * @returns {boolean}
 */
export function hasDirtyForms() {
	return dirtyFormCount.value > 0;
}
