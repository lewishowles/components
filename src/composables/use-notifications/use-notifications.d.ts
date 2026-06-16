import type { Ref } from "vue";

interface Notification {
	id?: string;
	message: string;
	onRead?: () => void;
	onRemove?: () => void;
	pinned?: boolean;
	read?: boolean;
	[key: string]: unknown;
}

interface StoredNotification extends Omit<Notification, "onRead" | "onRemove"> {
	id: string;
	read: boolean;
}

export declare function useNotifications(): {
	add(notification: Notification): void;
	clear(): void;
	markAllRead(): void;
	markRead(id: string): void;
	notifications: Ref<StoredNotification[]>;
	remove(id: string): void;
};
