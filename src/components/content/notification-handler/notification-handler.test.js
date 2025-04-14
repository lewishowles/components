import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import NotificationHandler from "./notification-handler.vue";
import NotificationDanger from "./fragments/notification-danger/notification-danger.vue";
import NotificationInfo from "./fragments/notification-info/notification-info.vue";
import NotificationRead from "./fragments/notification-read/notification-read.vue";
import NotificationWarning from "./fragments/notification-warning/notification-warning.vue";

const notificationMessage = "Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";
const notification = { id: "notification-1", message: notificationMessage };
const defaultProps = { notifications: [notification] };
const mount = createMount(NotificationHandler, { props: defaultProps });

describe("notification-handler", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalNotifications", () => {
			describe("should discard anything but non-empty array notifications", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, notifications]) => {
					const wrapper = mount({ notifications });
					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([]);
				});
			});

			describe("should discard any non-empty object notification", () => {
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
				])("%s", ([, notification]) => {
					const wrapper = mount({ notifications: [notification] });
					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([]);
				});
			});

			test("should discard any notification that does not contain a `message`", () => {
				const wrapper = mount({ notifications: [{ id: "id-123" }] });
				const vm = wrapper.vm;

				expect(vm.internalNotifications).toEqual([]);
			});

			test("should discard any read notification when `hideNotificationsWhenRead` is true", () => {
				const wrapper = mount({ notifications: [{ id: "id-123", read: true }] });
				const vm = wrapper.vm;

				expect(vm.internalNotifications).toEqual([]);
			});

			describe("Sorting by date", () => {
				test("should handle notifications where neither has a date", () => {
					const wrapper = mount({
						notifications: [
							{ id: "id-1", message: "Notification 1" },
							{ id: "id-2", message: "Notification 2" },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1" },
						{ id: "id-2", message: "Notification 2" },
					]);
				});

				test("should handle notifications where only the first has a date", () => {
					const wrapper = mount({
						notifications: [
							{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
							{ id: "id-2", message: "Notification 2" },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
						{ id: "id-2", message: "Notification 2" },
					]);
				});

				test("should handle notifications where only the second has a date", () => {
					const wrapper = mount({
						notifications: [
							{ id: "id-1", message: "Notification 1" },
							{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([
						{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
						{ id: "id-1", message: "Notification 1" },
					]);
				});

				test("should handle notifications where both have dates", () => {
					const wrapper = mount({
						notifications: [
							{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
							{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([
						{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
						{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
					]);
				});
			});

			describe("Limit the number of \"read\" notifications", () => {
				test("should return all notifications if `readNotificationCount` is not a number", () => {
					const wrapper = mount({
						readNotificationCount: "not-a-number",
						notifications: [
							{ id: "id-1", message: "Notification 1", read: true },
							{ id: "id-2", message: "Notification 2", read: false },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: true },
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});

				test("should return all notifications if `readNotificationCount` is undefined", () => {
					const wrapper = mount({
						notifications: [
							{ id: "id-1", message: "Notification 1", read: true },
							{ id: "id-2", message: "Notification 2", read: false },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: true },
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});

				test("should limit the number of read notifications to the value of `readNotificationCount`", () => {
					const wrapper = mount({
						readNotificationCount: 1,
						notifications: [
							{ id: "id-1", message: "Notification 1", read: true },
							{ id: "id-2", message: "Notification 2", read: true },
							{ id: "id-3", message: "Notification 3", read: false },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: true },
						{ id: "id-3", message: "Notification 3", read: false },
					]);
				});

				test("should not limit unread notifications", () => {
					const wrapper = mount({
						readNotificationCount: 1,
						notifications: [
							{ id: "id-1", message: "Notification 1", read: false },
							{ id: "id-2", message: "Notification 2", read: false },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: false },
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});

				test("should handle an empty notifications array", () => {
					const wrapper = mount({
						readNotificationCount: 1,
						notifications: [],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([]);
				});

				test("should handle a `readNotificationCount` of 0", () => {
					const wrapper = mount({
						readNotificationCount: 0,
						notifications: [
							{ id: "id-1", message: "Notification 1", read: true },
							{ id: "id-2", message: "Notification 2", read: false },
						],
					});

					const vm = wrapper.vm;

					expect(vm.internalNotifications).toEqual([{ id: "id-2", message: "Notification 2", read: false }]);
				});
			});
		});

		describe("unreadNotificationCount", () => {
			test("should return 0 if all notifications are marked as read", () => {
				const wrapper = mount({
					notifications: [
						{ id: "id-1", message: "Notification 1", read: true },
						{ id: "id-2", message: "Notification 2", read: true },
					],
				});

				const vm = wrapper.vm;

				expect(vm.unreadNotificationCount).toBe(0);
			});

			test("should return the correct count of unread notifications", () => {
				const wrapper = mount({
					notifications: [
						{ id: "id-1", message: "Notification 1", read: true },
						{ id: "id-2", message: "Notification 2", read: false },
						{ id: "id-3", message: "Notification 3", read: false },
					],
				});

				const vm = wrapper.vm;

				expect(vm.unreadNotificationCount).toBe(2);
			});

			test("should handle notifications without a `read` property", () => {
				const wrapper = mount({
					notifications: [
						{ id: "id-1", message: "Notification 1" },
						{ id: "id-2", message: "Notification 2", read: false },
						{ id: "id-3", message: "Notification 3", read: true },
					],
				});

				const vm = wrapper.vm;

				expect(vm.unreadNotificationCount).toBe(2);
			});

			test("should handle an empty `internalNotifications` array", () => {
				const wrapper = mount({ notifications: [] });
				const vm = wrapper.vm;

				expect(vm.unreadNotificationCount).toBe(0);
			});
		});
	});

	describe("Methods", () => {
		describe("sortNotificationsByDate", () => {
			test("should handle notifications where neither has a date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1" },
					{ id: "id-2", message: "Notification 2" },
				];

				expect(vm.sortNotificationsByDate(notifications)).toEqual([
					{ id: "id-1", message: "Notification 1" },
					{ id: "id-2", message: "Notification 2" },
				]);
			});

			test("should handle notifications where only the first has a date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
					{ id: "id-2", message: "Notification 2" },
				];

				expect(vm.sortNotificationsByDate(notifications)).toEqual([
					{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
					{ id: "id-2", message: "Notification 2" },
				]);
			});

			test("should handle notifications where only the second has a date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1" },
					{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
				];

				expect(vm.sortNotificationsByDate(notifications)).toEqual([
					{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
					{ id: "id-1", message: "Notification 1" },
				]);
			});

			test("should handle notifications where both have dates", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
					{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
				];

				expect(vm.sortNotificationsByDate(notifications)).toEqual([
					{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
					{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
				]);
			});
		});

		describe("limitReadNotifications", () => {
			test("should return all notifications if `readNotificationCount` is not a number", () => {
				const wrapper = mount({ readNotificationCount: "not-a-number" });
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-2", message: "Notification 2", read: false },
				];

				expect(vm.limitReadNotifications(notifications)).toEqual(notifications);
			});

			test("should return all notifications if `readNotificationCount` is undefined", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-2", message: "Notification 2", read: false },
				];

				expect(vm.limitReadNotifications(notifications)).toEqual(notifications);
			});

			test("should limit the number of read notifications to the value of `readNotificationCount`", () => {
				const wrapper = mount({ readNotificationCount: 1 });
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-2", message: "Notification 2", read: true },
					{ id: "id-3", message: "Notification 3", read: false },
				];

				expect(vm.limitReadNotifications(notifications)).toEqual([
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-3", message: "Notification 3", read: false },
				]);
			});

			test("should not limit unread notifications", () => {
				const wrapper = mount({ readNotificationCount: 1 });
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1", read: false },
					{ id: "id-2", message: "Notification 2", read: false },
				];

				expect(vm.limitReadNotifications(notifications)).toEqual(notifications);
			});

			test("should handle an empty notifications array", () => {
				const wrapper = mount({ readNotificationCount: 1 });
				const vm = wrapper.vm;

				expect(vm.limitReadNotifications([])).toEqual([]);
			});

			test("should handle a `readNotificationCount` of 0", () => {
				const wrapper = mount({ readNotificationCount: 0 });
				const vm = wrapper.vm;

				const notifications = [
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-2", message: "Notification 2", read: false },
				];

				expect(vm.limitReadNotifications(notifications)).toEqual([{ id: "id-2", message: "Notification 2", read: false }]);
			});
		});

		describe("getNotificationSlotName", () => {
			test("should return \"notification-danger-template\" if the notification has type \"danger\"", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { type: "danger" };

				expect(vm.getNotificationSlotName(notification)).toEqual("notification-danger-template");
			});

			test("should return \"notification-warning-template\" if the notification has type \"warning\"", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { type: "warning" };

				expect(vm.getNotificationSlotName(notification)).toEqual("notification-warning-template");
			});

			test("should return 'notification-read-template' if the notification is marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { read: true };

				expect(vm.getNotificationSlotName(notification)).toBe("notification-read-template");
			});

			test("should return 'notification-read-template' if the notification is marked as read, even if it has a type", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { read: true, type: "danger" };

				expect(vm.getNotificationSlotName(notification)).toBe("notification-read-template");
			});

			test("should return 'notification-read-template' if the notification has been marked as read since initialisation", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { id: "notification-1", type: "danger" };

				vm.notificationsMarkedAsRead = ["notification-1"];

				expect(vm.getNotificationSlotName(notification)).toBe("notification-read-template");
			});

			test("should return 'notification-info-template' if the notification is not marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { read: false };

				expect(vm.getNotificationSlotName(notification)).toBe("notification-info-template");
			});

			test("should return 'notification-info-template' if the notification does not have a 'read' property", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { message: "Notification without read property" };

				expect(vm.getNotificationSlotName(notification)).toBe("notification-info-template");
			});
		});

		describe("getNotificationComponent", () => {
			test("should return NotificationDanger if the notification has type \"danger\"", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { type: "danger" };

				expect(vm.getNotificationComponent(notification)).toEqual(NotificationDanger);
			});

			test("should return NotificationWarning if the notification has type \"warning\"", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { type: "warning" };

				expect(vm.getNotificationComponent(notification)).toEqual(NotificationWarning);
			});

			test("should return NotificationRead if the notification is marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { read: true };

				expect(vm.getNotificationComponent(notification)).toEqual(NotificationRead);
			});

			test("should return NotificationInfo if the notification is not marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { read: false };

				expect(vm.getNotificationComponent(notification)).toEqual(NotificationInfo);
			});

			test("should return NotificationInfo if the notification does not have a 'read' property", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { message: "Notification without read property" };

				expect(vm.getNotificationComponent(notification)).toEqual(NotificationInfo);
			});
		});

		describe("allowMarkReadForNotification", () => {
			describe("should default to true for anything but a non-empty object notification", () => {
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
				])("%s", ([, notification]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(vm.allowMarkReadForNotification(notification)).toBe(true);
				});
			});

			test("should return false if the notification is already read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.allowMarkReadForNotification({ read: true })).toBe(false);
			});

			test("should return false if the notification is pinned", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.allowMarkReadForNotification({ pinned: true })).toBe(false);
			});

			test("should return false if the notification is both read and pinned", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.allowMarkReadForNotification({ read: true, pinned: true })).toBe(false);
			});

			test("should return true if the notification is neither read nor pinned", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.allowMarkReadForNotification({ read: false, pinned: false })).toBe(true);
			});

			test("should return true if the notification does not have a 'read' or 'pinned' property", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.allowMarkReadForNotification({ message: "Notification without read or pinned property" })).toBe(true);
			});

			test("should return true if the notification has been manually marked as read by the user", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.notificationsMarkedAsRead = ["notification-1"];

				expect(vm.allowMarkReadForNotification({ id: "notification-1", message: "Notification without read or pinned property" })).toBe(false);
			});
		});

		describe("markNotificationRead", () => {
			describe("should not emit if the provided ID is not a non-empty string", () => {
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
				])("%s", ([, id]) => {
					const wrapper = mount({ notifications: [{ ...notification, id }] });
					const vm = wrapper.vm;

					vm.markNotificationRead(id);

					expect(wrapper.emitted("notifications:read")).toBeUndefined();
				});
			});

			test("should emit a notification ID", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.markNotificationRead(notification.id);

				expect(wrapper.emitted("notifications:read")).toEqual([[["notification-1"]]]);
				expect(vm.notificationsMarkedAsRead).toEqual(["notification-1"]);
			});
		});

		describe("hasNotificationBeenMarkedAsRead", () => {
			describe("should return false for anything but a non-empty string ID", () => {
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
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(vm.hasNotificationBeenMarkedAsRead(input)).toBe(false);
				});
			});

			describe("should return false if notificationsMarkedAsRead is anything but a non-empty array", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					vm.notificationsMarkedAsRead = input;

					expect(vm.hasNotificationBeenMarkedAsRead("notification-1")).toBe(false);
				});
			});

			test("should determine if a notification has been marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.notificationsMarkedAsRead = ["notification-1"];

				expect(vm.hasNotificationBeenMarkedAsRead("notification-1")).toBe(true);
				expect(vm.hasNotificationBeenMarkedAsRead("notification-2")).toBe(false);
			});
		});
	});
});
