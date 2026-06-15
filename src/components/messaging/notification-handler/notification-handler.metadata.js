// Metadata for docs and CLI consumers that need to describe or generate notification-handler usage.
export const notificationHandlerMetadata = {
	name: "notification-handler",
	category: "messaging",
	summary: "A notification centre backed by useNotifications.",
	props: [
		{
			name: "locale",
			type: "string",
			default: undefined,
			summary: "Locale used for notification date formatting.",
		},
		{
			name: "dateFormat",
			type: "object",
			default: undefined,
			summary: "Intl date formatting options for notification dates.",
		},
		{
			name: "align",
			type: "string",
			default: "right",
			values: ["left", "right"],
			summary: "Horizontal alignment for the notification panel.",
		},
		{
			name: "allowMarkAllRead",
			type: "boolean",
			default: true,
			summary: "Show the mark-all-read action.",
		},
		{
			name: "allowReload",
			type: "boolean",
			default: false,
			summary: "Show the reload action.",
		},
		{
			name: "loading",
			type: "boolean",
			default: false,
			summary: "Show the loading state.",
		},
		{
			name: "hideNotificationsWhenRead",
			type: "boolean",
			default: false,
			summary: "Hide read notifications from the list.",
		},
		{
			name: "readNotificationCount",
			type: "number",
			default: 0,
			summary: "Externally supplied read notification count.",
		},
	],
	slots: [
		{
			name: "notification-read-template",
			summary: "Template for read notifications.",
		},
		{
			name: "notification-unread-template",
			summary: "Template for unread notifications.",
		},
		{
			name: "notification-<type>-template",
			summary: "Template for notifications of a matching type.",
		},
		{
			name: "notification-pinned-template",
			summary: "Template for pinned notifications.",
		},
		{
			name: "notification-<id>-template",
			summary: "Template for a notification with a matching ID.",
		},
		{
			name: "notification-actions",
			summary: "Actions displayed for each notification.",
		},
		{
			name: "show-notifications-label",
			summary: "Accessible label for the notification trigger.",
		},
		{
			name: "no-notifications-label",
			summary: "Empty-state text.",
		},
		{
			name: "mark-all-read-label",
			summary: "Label for the mark-all-read action.",
		},
		{
			name: "reload-label",
			summary: "Label for the reload action.",
		},
		{
			name: "loading-label",
			summary: "Text announced while notifications load.",
		},
		{
			name: "mark-read-label",
			summary: "Label for marking a notification read.",
		},
		{
			name: "view-more-label",
			summary: "Label for opening more notification detail.",
		},
	],
	events: [
		{
			name: "notifications:reload",
			summary: "Emitted when the reload action is triggered.",
		},
	],
	examples: [],
};
