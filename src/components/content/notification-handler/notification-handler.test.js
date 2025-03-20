import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NotificationHandler from "./notification-handler.vue";

const mount = createMount(NotificationHandler);

describe("notification-handler", () => {
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
		});
	});
});
