import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NotificationBase from "./notification-base.vue";

const notificationMessage = "Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";
const notification = { id: "notification-1", message: notificationMessage };
const defaultProps = { notification };
const mount = createMount(NotificationBase, { props: defaultProps });

describe("notification-base", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
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
					const wrapper = mount({ notification: { ...notification, id } });
					const vm = wrapper.vm;

					vm.markNotificationRead();

					expect(wrapper.emitted("notification:read")).toBeUndefined();
				});
			});

			test("should emit a notification ID", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.markNotificationRead();

				expect(wrapper.emitted("notification:read")).toEqual([["notification-1"]]);
			});
		});
	});
});
