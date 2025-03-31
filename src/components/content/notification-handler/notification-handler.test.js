import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import NotificationHandler from "./notification-handler.vue";
import NotificationInfo from "./fragments/notification-info/notification-info.vue";
import NotificationRead from "./fragments/notification-read/notification-read.vue";

const mount = createMount(NotificationHandler);

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
			test("should return 'notification-read-template' if the notification is marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const notification = { read: true };

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
	});
});
