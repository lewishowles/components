import { hasDirtyForms } from "./dirty-forms-registry.js";

/**
 * Installs a single, app-wide navigation guard that blocks routing away
 * while any useForm instance is dirty. Call once, wherever the app builds
 * its router; every useForm instance with unsavedChangesGuard enabled
 * (the default) contributes to the shared dirty-form count this checks.
 *
 * Takes the router instance directly rather than importing anything from
 * vue-router, so this library carries no dependency on it.
 *
 * @param  {object}  router
 *     A Vue Router instance, or anything shaped like one (i.e. exposing a
 *     beforeEach method).
 * @param  {object}  [options]
 * @param  {string}  [options.message]
 *     The message shown in the confirm dialog before blocking navigation.
 */
export function installUnsavedChangesGuard(router, options = {}) {
	const { message = "You have unsaved changes. Are you sure you want to leave?" } = options;

	router.beforeEach(() => {
		if (!hasDirtyForms()) {
			return true;
		}

		return window.confirm(message);
	});
}
