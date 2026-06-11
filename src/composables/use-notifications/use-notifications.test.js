import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { useNotifications } from "./use-notifications.js";

const notificationMessage = "Exercitation laboris aliquip magna proident voluptate.";

const notification = { id: "notification-1", message: notificationMessage };

/**
 * Match a stored notification with an automatically-assigned `read` default.
 *
 * @param  {object}  notification
 *     The added notification to match.
 */
function expectStoredNotification(notification) {
	return {
		read: false,
		...notification,
	};
}

describe("useNotifications", () => {
	afterEach(() => {
		const { clear } = useNotifications();

		clear();
	});

	describe("Initialisation", () => {
		test("should initialise", () => {
			const result = useNotifications();

			expect(result).toBeTypeOf("object");
			expect(result.add).toBeTypeOf("function");
			expect(result.remove).toBeTypeOf("function");
			expect(result.markRead).toBeTypeOf("function");
			expect(result.markAllRead).toBeTypeOf("function");
			expect(result.clear).toBeTypeOf("function");
		});
	});

	describe("Methods", () => {
		describe("add", () => {
			describe("should not add anything for invalid notification input", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const { add, notifications } = useNotifications();

					add(input);

					expect(notifications.value).toEqual([]);
				});
			});

			test("should not add a notification without a message", () => {
				const { add, notifications } = useNotifications();

				add({ id: "id-1" });

				expect(notifications.value).toEqual([]);
			});

			test("should add a valid notification", () => {
				const { add, notifications } = useNotifications();

				add(notification);

				expect(notifications.value).toEqual([expectStoredNotification(notification)]);
			});

			test("should default read to false", () => {
				const { add, notifications } = useNotifications();

				add({ message: "Hello" });

				expect(notifications.value[0].read).toBe(false);
			});

			test("should preserve a provided read status", () => {
				const { add, notifications } = useNotifications();

				add({ ...notification, read: true });

				expect(notifications.value[0].read).toBe(true);
			});

			test("should generate a UUID when no id is provided", () => {
				const { add, notifications } = useNotifications();

				add({ message: "Hello" });

				expect(notifications.value[0].id).toBeTypeOf("string");
				expect(notifications.value[0].id.length).toBeGreaterThan(0);
			});

			test("should use the provided id", () => {
				const { add, notifications } = useNotifications();

				add(notification);

				expect(notifications.value[0].id).toBe("notification-1");
			});

			test("should not store onRead and onRemove on the notification object", () => {
				const onRead = vi.fn();
				const onRemove = vi.fn();
				const { add, notifications } = useNotifications();

				add({ ...notification, onRead, onRemove });

				expect(notifications.value[0]).not.toHaveProperty("onRead");
				expect(notifications.value[0]).not.toHaveProperty("onRemove");
			});

			test("should add multiple notifications", () => {
				const { add, notifications } = useNotifications();

				add(notification);
				add({ id: "notification-2", message: "Second" });

				expect(notifications.value).toHaveLength(2);
			});
		});

		describe("remove", () => {
			describe("should not remove anything for invalid ID input", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const { add, notifications, remove } = useNotifications();

					add(notification);
					remove(input);

					expect(notifications.value).toHaveLength(1);
				});
			});

			test("should remove a notification by ID", () => {
				const { add, notifications, remove } = useNotifications();

				add(notification);
				remove("notification-1");

				expect(notifications.value).toEqual([]);
			});

			test("should call the onRemove callback", () => {
				const onRemove = vi.fn();
				const { add, remove } = useNotifications();

				add({ ...notification, onRemove });
				remove("notification-1");

				expect(onRemove).toHaveBeenCalledOnce();
			});

			test("should not throw if no onRemove callback is registered", () => {
				const { add, remove } = useNotifications();

				add(notification);

				expect(() => remove("notification-1")).not.toThrow();
			});

			test("should not remove notifications with a non-matching ID", () => {
				const { add, notifications, remove } = useNotifications();

				add(notification);
				remove("non-existent-id");

				expect(notifications.value).toHaveLength(1);
			});
		});

		describe("markRead", () => {
			describe("should not mark anything for invalid ID input", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const { add, markRead, notifications } = useNotifications();

					add(notification);
					markRead(input);

					expect(notifications.value[0].read).toBe(false);
				});
			});

			test("should mark a notification as read", () => {
				const { add, markRead, notifications } = useNotifications();

				add(notification);
				markRead("notification-1");

				expect(notifications.value[0].read).toBe(true);
			});

			test("should call the onRead callback", () => {
				const onRead = vi.fn();
				const { add, markRead } = useNotifications();

				add({ ...notification, onRead });
				markRead("notification-1");

				expect(onRead).toHaveBeenCalledOnce();
			});

			test("should not throw if no onRead callback is registered", () => {
				const { add, markRead } = useNotifications();

				add(notification);

				expect(() => markRead("notification-1")).not.toThrow();
			});

			test("should not mark a notification with a non-matching ID", () => {
				const { add, markRead, notifications } = useNotifications();

				add(notification);
				markRead("non-existent-id");

				expect(notifications.value[0].read).toBe(false);
			});
		});

		describe("markAllRead", () => {
			test("should mark all unread non-pinned notifications as read", () => {
				const { add, markAllRead, notifications } = useNotifications();

				add({ id: "id-1", message: "First" });
				add({ id: "id-2", message: "Second" });
				markAllRead();

				expect(notifications.value[0].read).toBe(true);
				expect(notifications.value[1].read).toBe(true);
			});

			test("should not mark pinned notifications as read", () => {
				const { add, markAllRead, notifications } = useNotifications();

				add({ id: "id-1", message: "First", pinned: true });
				add({ id: "id-2", message: "Second" });
				markAllRead();

				expect(notifications.value[0].read).toBe(false);
				expect(notifications.value[1].read).toBe(true);
			});

			test("should not call onRead for already-read notifications", () => {
				const onRead = vi.fn();
				const { add, markAllRead } = useNotifications();

				add({ id: "id-1", message: "First", read: true, onRead });
				markAllRead();

				expect(onRead).not.toHaveBeenCalled();
			});

			test("should call onRead for each newly-read notification", () => {
				const onRead1 = vi.fn();
				const onRead2 = vi.fn();
				const { add, markAllRead } = useNotifications();

				add({ id: "id-1", message: "First", onRead: onRead1 });
				add({ id: "id-2", message: "Second", onRead: onRead2 });
				markAllRead();

				expect(onRead1).toHaveBeenCalledOnce();
				expect(onRead2).toHaveBeenCalledOnce();
			});

			test("should do nothing if there are no notifications", () => {
				const { markAllRead, notifications } = useNotifications();

				expect(() => markAllRead()).not.toThrow();
				expect(notifications.value).toEqual([]);
			});
		});

		describe("clear", () => {
			test("should remove all notifications", () => {
				const { add, clear, notifications } = useNotifications();

				add(notification);
				add({ id: "notification-2", message: "Second" });
				clear();

				expect(notifications.value).toEqual([]);
			});

			test("should do nothing if there are no notifications", () => {
				const { clear, notifications } = useNotifications();

				expect(() => clear()).not.toThrow();
				expect(notifications.value).toEqual([]);
			});
		});
	});
});
