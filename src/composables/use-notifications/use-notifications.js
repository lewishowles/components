import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { ref } from "vue";

// The stored notifications.
const notifications = ref([]);

// Per-notification callbacks, keyed by ID. Kept outside the reactive array so
// function references are never proxied.
const callbacks = new Map();

/**
 * Store and manage notifications. The composable is module-scoped — all
 * `useNotifications()` calls share the same registry.
 */
export function useNotifications() {
	/**
	 * Add a notification to the registry.
	 *
	 * @param  {object}  notification
	 *     The notification to add. Must contain a `message` field.
	 * @param  {string}  [notification.id]
	 *     Unique identifier. Auto-generated if not provided.
	 * @param  {function}  [notification.onRead]
	 *     Called when the notification is marked as read, e.g. to sync with a
	 *     backend.
	 * @param  {function}  [notification.onRemove]
	 *     Called when the notification is removed, e.g. to sync with a backend.
	 */
	function add(notification) {
		if (!isNonEmptyObject(notification)) {
			return;
		}

		if (!Object.hasOwn(notification, "message")) {
			return;
		}

		const { onRead, onRemove, ...notificationData } = notification;
		const id = isNonEmptyString(notificationData.id) ? notificationData.id : crypto.randomUUID();

		notifications.value.push({ read: false, ...notificationData, id });

		if (onRead || onRemove) {
			callbacks.set(id, { onRead, onRemove });
		}
	}

	/**
	 * Remove a notification by ID, calling its `onRemove` callback if
	 * registered.
	 *
	 * @param  {string}  id
	 */
	function remove(id) {
		if (!isNonEmptyString(id)) {
			return;
		}

		callbacks.get(id)?.onRemove?.();
		callbacks.delete(id);
		notifications.value = notifications.value.filter((notification) => notification.id !== id);
	}

	/**
	 * Mark a single notification as read, calling its `onRead` callback if
	 * registered.
	 *
	 * @param  {string}  id
	 */
	function markRead(id) {
		if (!isNonEmptyString(id)) {
			return;
		}

		const notification = notifications.value.find((notification) => notification.id === id);

		if (!notification) {
			return;
		}

		callbacks.get(id)?.onRead?.();
		notification.read = true;
	}

	/**
	 * Mark all non-pinned, unread notifications as read, calling each `onRead`
	 * callback if registered.
	 */
	function markAllRead() {
		notifications.value
			.filter((notification) => notification.read !== true && notification.pinned !== true)
			.forEach((notification) => {
				callbacks.get(notification.id)?.onRead?.();
				notification.read = true;
			});
	}

	/**
	 * Remove all notifications from the registry.
	 */
	function clear() {
		callbacks.clear();
		notifications.value = [];
	}

	return {
		add,
		clear,
		markAllRead,
		markRead,
		notifications,
		remove,
	};
}
