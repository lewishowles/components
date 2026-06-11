import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { createMount } from "@unit/support/mount";
import { useNotifications } from "@/composables/use-notifications/use-notifications.js";
import NotificationDanger from "./fragments/notification-danger/notification-danger.vue";
import NotificationInfo from "./fragments/notification-info/notification-info.vue";
import NotificationRead from "./fragments/notification-read/notification-read.vue";
import NotificationWarning from "./fragments/notification-warning/notification-warning.vue";
import NotificationHandler from "./notification-handler.vue";

const notificationMessage =
	"Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";

const notification = { id: "notification-1", message: notificationMessage };

const mount = createMount(NotificationHandler, { props: {} });

const { add, clear, notifications } = useNotifications();

beforeEach(() => {
	clear();
});

afterEach(() => {
	clear();
});

describe("notification-handler", () => {
	console.warn = vi.fn();

	describe("Expose", () => {
		test("exposes notifications as the filtered internal list", () => {
			add(notification);

			const wrapper = mount();

			expect(wrapper.vm.notifications).toEqual([{ ...notification, read: false }]);
		});

		test("exposes unreadCount", () => {
			add(notification);

			const wrapper = mount();

			expect(wrapper.vm.unreadCount).toBe(1);
		});

		test("exposes markAllRead as a function", () => {
			const wrapper = mount();

			expect(wrapper.vm.markAllRead).toBeTypeOf("function");
		});
	});

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalNotifications", () => {
			test("should return an empty list when no notifications have been added", () => {
				const wrapper = mount();

				expect(wrapper.vm.internalNotifications).toEqual([]);
			});

			test("should discard any read notification when `hideNotificationsWhenRead` is true", () => {
				add({ id: "id-123", message: "Test", read: true });

				const wrapper = mount({ hideNotificationsWhenRead: true });

				expect(wrapper.vm.internalNotifications).toEqual([]);
			});

			describe("Sorting by date", () => {
				test("should handle notifications where neither has a date", () => {
					add({ id: "id-1", message: "Notification 1" });
					add({ id: "id-2", message: "Notification 2" });

					const wrapper = mount();

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: false },
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});

				test("should handle notifications where only the first has a date", () => {
					add({ id: "id-1", message: "Notification 1", date: "2025-01-01" });
					add({ id: "id-2", message: "Notification 2" });

					const wrapper = mount();

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", date: "2025-01-01", read: false },
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});

				test("should handle notifications where only the second has a date", () => {
					add({ id: "id-1", message: "Notification 1" });
					add({ id: "id-2", message: "Notification 2", date: "2025-01-02" });

					const wrapper = mount();

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-2", message: "Notification 2", date: "2025-01-02", read: false },
						{ id: "id-1", message: "Notification 1", read: false },
					]);
				});

				test("should handle notifications where both have dates", () => {
					add({ id: "id-1", message: "Notification 1", date: "2025-01-01" });
					add({ id: "id-2", message: "Notification 2", date: "2025-01-02" });

					const wrapper = mount();

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-2", message: "Notification 2", date: "2025-01-02", read: false },
						{ id: "id-1", message: "Notification 1", date: "2025-01-01", read: false },
					]);
				});
			});

			describe('Limit the number of "read" notifications', () => {
				test("should return all notifications if `readNotificationCount` is not a number", () => {
					add({ id: "id-1", message: "Notification 1", read: true });
					add({ id: "id-2", message: "Notification 2", read: false });

					const wrapper = mount({ readNotificationCount: "not-a-number" });

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: true },
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});

				test("should return all notifications if `readNotificationCount` is undefined", () => {
					add({ id: "id-1", message: "Notification 1", read: true });
					add({ id: "id-2", message: "Notification 2", read: false });

					const wrapper = mount();

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: true },
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});

				test("should limit the number of read notifications to the value of `readNotificationCount`", () => {
					add({ id: "id-1", message: "Notification 1", read: true });
					add({ id: "id-2", message: "Notification 2", read: true });
					add({ id: "id-3", message: "Notification 3", read: false });

					const wrapper = mount({ readNotificationCount: 1 });

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: true },
						{ id: "id-3", message: "Notification 3", read: false },
					]);
				});

				test("should not limit unread notifications", () => {
					add({ id: "id-1", message: "Notification 1", read: false });
					add({ id: "id-2", message: "Notification 2", read: false });

					const wrapper = mount({ readNotificationCount: 1 });

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-1", message: "Notification 1", read: false },
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});

				test("should handle a `readNotificationCount` of 0", () => {
					add({ id: "id-1", message: "Notification 1", read: true });
					add({ id: "id-2", message: "Notification 2", read: false });

					const wrapper = mount({ readNotificationCount: 0 });

					expect(wrapper.vm.internalNotifications).toEqual([
						{ id: "id-2", message: "Notification 2", read: false },
					]);
				});
			});
		});

		describe("unreadNotificationCount", () => {
			test("should return 0 if all notifications are marked as read", () => {
				add({ id: "id-1", message: "Notification 1", read: true });
				add({ id: "id-2", message: "Notification 2", read: true });

				const wrapper = mount();

				expect(wrapper.vm.unreadNotificationCount).toBe(0);
			});

			test("should return the correct count of unread notifications", () => {
				add({ id: "id-1", message: "Notification 1", read: true });
				add({ id: "id-2", message: "Notification 2", read: false });
				add({ id: "id-3", message: "Notification 3", read: false });

				const wrapper = mount();

				expect(wrapper.vm.unreadNotificationCount).toBe(2);
			});

			test("should handle notifications without a `read` property", () => {
				add({ id: "id-1", message: "Notification 1" });
				add({ id: "id-2", message: "Notification 2", read: false });
				add({ id: "id-3", message: "Notification 3", read: true });

				const wrapper = mount();

				expect(wrapper.vm.unreadNotificationCount).toBe(2);
			});

			test("should handle an empty notifications registry", () => {
				const wrapper = mount();

				expect(wrapper.vm.unreadNotificationCount).toBe(0);
			});
		});

		describe("triggerLabel", () => {
			test("should return the default label when there are no unread notifications", () => {
				const wrapper = mount();

				expect(wrapper.vm.triggerLabel).toBe("Show notifications");
			});

			test("should include the unread count when there is one unread notification", () => {
				add(notification);

				const wrapper = mount();

				expect(wrapper.vm.triggerLabel).toBe("Show notifications, 1 unread");
			});

			test("should include the unread count when there are multiple unread notifications", () => {
				add({ id: "notification-1", message: "First" });
				add({ id: "notification-2", message: "Second" });
				add({ id: "notification-3", message: "Third" });

				const wrapper = mount();

				expect(wrapper.vm.triggerLabel).toBe("Show notifications, 3 unread");
			});

			test("should return the default label when all notifications are read", () => {
				add({ id: "notification-1", message: "First", read: true });

				const wrapper = mount();

				expect(wrapper.vm.triggerLabel).toBe("Show notifications");
			});
		});
	});

	describe("Methods", () => {
		describe("sortNotificationsByDate", () => {
			test("should handle notifications where neither has a date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1" },
					{ id: "id-2", message: "Notification 2" },
				];

				expect(vm.sortNotificationsByDate(testNotifications)).toEqual([
					{ id: "id-1", message: "Notification 1" },
					{ id: "id-2", message: "Notification 2" },
				]);
			});

			test("should handle notifications where only the first has a date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
					{ id: "id-2", message: "Notification 2" },
				];

				expect(vm.sortNotificationsByDate(testNotifications)).toEqual([
					{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
					{ id: "id-2", message: "Notification 2" },
				]);
			});

			test("should handle notifications where only the second has a date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1" },
					{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
				];

				expect(vm.sortNotificationsByDate(testNotifications)).toEqual([
					{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
					{ id: "id-1", message: "Notification 1" },
				]);
			});

			test("should handle notifications where both have dates", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
					{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
				];

				expect(vm.sortNotificationsByDate(testNotifications)).toEqual([
					{ id: "id-2", message: "Notification 2", date: "2025-01-02" },
					{ id: "id-1", message: "Notification 1", date: "2025-01-01" },
				]);
			});
		});

		describe("limitReadNotifications", () => {
			test("should return all notifications if `readNotificationCount` is not a number", () => {
				const wrapper = mount({ readNotificationCount: "not-a-number" });
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-2", message: "Notification 2", read: false },
				];

				expect(vm.limitReadNotifications(testNotifications)).toEqual(testNotifications);
			});

			test("should return all notifications if `readNotificationCount` is undefined", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-2", message: "Notification 2", read: false },
				];

				expect(vm.limitReadNotifications(testNotifications)).toEqual(testNotifications);
			});

			test("should limit the number of read notifications to the value of `readNotificationCount`", () => {
				const wrapper = mount({ readNotificationCount: 1 });
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-2", message: "Notification 2", read: true },
					{ id: "id-3", message: "Notification 3", read: false },
				];

				expect(vm.limitReadNotifications(testNotifications)).toEqual([
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-3", message: "Notification 3", read: false },
				]);
			});

			test("should not limit unread notifications", () => {
				const wrapper = mount({ readNotificationCount: 1 });
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1", read: false },
					{ id: "id-2", message: "Notification 2", read: false },
				];

				expect(vm.limitReadNotifications(testNotifications)).toEqual(testNotifications);
			});

			test("should handle an empty notifications array", () => {
				const wrapper = mount({ readNotificationCount: 1 });
				const vm = wrapper.vm;

				expect(vm.limitReadNotifications([])).toEqual([]);
			});

			test("should handle a `readNotificationCount` of 0", () => {
				const wrapper = mount({ readNotificationCount: 0 });
				const vm = wrapper.vm;

				const testNotifications = [
					{ id: "id-1", message: "Notification 1", read: true },
					{ id: "id-2", message: "Notification 2", read: false },
				];

				expect(vm.limitReadNotifications(testNotifications)).toEqual([
					{ id: "id-2", message: "Notification 2", read: false },
				]);
			});
		});

		describe("getNotificationSlotName", () => {
			test('should return "notification-danger-template" if the notification has type "danger"', () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationSlotName({ type: "danger" })).toEqual(
					"notification-danger-template",
				);
			});

			test('should return "notification-warning-template" if the notification has type "warning"', () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationSlotName({ type: "warning" })).toEqual(
					"notification-warning-template",
				);
			});

			test("should return 'notification-read-template' if the notification is marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationSlotName({ read: true })).toBe("notification-read-template");
			});

			test("should return 'notification-read-template' if the notification is marked as read, even if it has a type", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationSlotName({ read: true, type: "danger" })).toBe(
					"notification-read-template",
				);
			});

			test("should return 'notification-info-template' if the notification is not marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationSlotName({ read: false })).toBe("notification-info-template");
			});

			test("should return 'notification-info-template' if the notification does not have a 'read' property", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationSlotName({ message: "Notification without read property" })).toBe(
					"notification-info-template",
				);
			});
		});

		describe("getNotificationComponent", () => {
			test('should return NotificationDanger if the notification has type "danger"', () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationComponent({ type: "danger" })).toEqual(NotificationDanger);
			});

			test('should return NotificationWarning if the notification has type "warning"', () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationComponent({ type: "warning" })).toEqual(NotificationWarning);
			});

			test("should return NotificationRead if the notification is marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationComponent({ read: true })).toEqual(NotificationRead);
			});

			test("should return NotificationInfo if the notification is not marked as read", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getNotificationComponent({ read: false })).toEqual(NotificationInfo);
			});

			test("should return NotificationInfo if the notification does not have a 'read' property", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(
					vm.getNotificationComponent({ message: "Notification without read property" }),
				).toEqual(NotificationInfo);
			});
		});

		describe("markNotificationRead", () => {
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
				])("%s", ([, id]) => {
					add(notification);

					const wrapper = mount();

					wrapper.vm.markNotificationRead(id);

					expect(notifications.value[0].read).toBe(false);
				});
			});

			test("should mark the notification as read in the registry", () => {
				add(notification);

				const wrapper = mount();

				wrapper.vm.markNotificationRead("notification-1");

				expect(notifications.value[0].read).toBe(true);
			});
		});

		describe("reloadNotifications", () => {
			test("should emit an event", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.reloadNotifications();

				expect(wrapper.emitted("notifications:reload")).not.toBeUndefined();
			});

			test("should not emit an event if `allowReload` is false", () => {
				const wrapper = mount({ allowReload: false });
				const vm = wrapper.vm;

				vm.reloadNotifications();

				expect(wrapper.emitted("notifications:reload")).toBeUndefined();
			});
		});

		describe("markAllNotificationsRead", () => {
			test("should do nothing if there are no unread notifications", () => {
				const wrapper = mount();

				wrapper.vm.markAllNotificationsRead();

				expect(notifications.value).toEqual([]);
			});

			test("should mark all unread non-pinned notifications as read", () => {
				add({ id: "notification-1", message: "Notification", pinned: false, read: false });
				add({ id: "notification-2", message: "Notification", pinned: true, read: false });
				add({ id: "notification-3", message: "Notification", pinned: false, read: false });

				const wrapper = mount();

				wrapper.vm.markAllNotificationsRead();

				expect(notifications.value.find((n) => n.id === "notification-1").read).toBe(true);
				expect(notifications.value.find((n) => n.id === "notification-2").read).toBe(false);
				expect(notifications.value.find((n) => n.id === "notification-3").read).toBe(true);
			});

			test("should not affect notifications that are already marked as read", () => {
				add({ id: "notification-1", message: "Notification", read: true });
				add({ id: "notification-2", message: "Notification", read: false });

				const wrapper = mount();

				wrapper.vm.markAllNotificationsRead();

				expect(notifications.value.find((n) => n.id === "notification-1").read).toBe(true);
				expect(notifications.value.find((n) => n.id === "notification-2").read).toBe(true);
			});
		});
	});
});
