import { ref } from "vue";

// The stored messages.
const messages = ref([]);

/**
 * Store and manage messages. Messages can be optionally namespaced to signal
 * their intent.
 */
export function useFlashMessages() {
	/**
	 * Send a message, to be retrieved by displaying components.
	 *
	 * @param  {object}  message
	 *     The message configuration
	 * @param  {string}  [message.type]
	 *     The message type, passed through to `alert-message`. One of
	 *     "success", "error", "warning", "info" or "muted"
	 * @param  {string}  [message.title]
	 *     The title used for the message
	 * @param  {string}  [message.message]
	 *     The content of the message
	 * @param  {string}  [message.namespace]
	 *     The optional namespace used to target a specific `flash-messages`
	 *     instance
	 * @param  {boolean}  [message.showIcon]
	 *     Whether the default `alert-message` output should show an icon
	 * @param  {boolean}  [message.live]
	 *     Whether the default `alert-message` output should behave as a live
	 *     region
	 * @param  {string}  [message.titleTag]
	 *     The tag used for the title in the default `alert-message` output
	 */
	function sendMessage(message) {
		messages.value.push({
			id: crypto.randomUUID(),
			...message,
		});
	}

	/**
	 * Get messages for a given namespace.
	 *
	 * @param  {string}  namespace
	 *     The namespace of messages to get. No provided namespace means
	 *     matching messages without a namespace will be retrieved.
	 */
	function getMessages(namespace) {
		return messages.value.filter((message) => {
			if (namespace) {
				return message.namespace === namespace;
			}

			return !message.namespace;
		});
	}

	/**
	 * Clear messages for a given namespace.
	 *
	 * @param  {string}  namespace
	 *     The namespace of messages to clear. No provided namespace means
	 *     matching messages without a namespace will be cleared.
	 */
	function clearMessages(namespace) {
		messages.value = messages.value.filter((message) => {
			if (namespace) {
				return message.namespace !== namespace;
			}

			return Boolean(message.namespace);
		});
	}

	/**
	 * Clear all flash messages. Intended for test isolation and exceptional
	 * global resets.
	 */
	function _clearMessages() {
		messages.value = [];
	}

	return {
		_clearMessages,
		clearMessages,
		getMessages,
		sendMessage,
	};
}
