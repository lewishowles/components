import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";

import RelativeDate from "./relative-date.vue";

const relativeTo = "2025-03-29T13:15:20";
const defaultProps = { date: "2025-03-29T13:14:50", locale: "en-GB", relativeTo };
const mount = createMount(RelativeDate, { props: defaultProps });

describe("relative-date", () => {
	console.error = vi.fn();
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Render contracts", () => {
		test("Keeps the current-time fallback in the default slot", () => {
			const wrapper = mount({ date: relativeTo });

			expect(wrapper.text()).toBe("Just now");
		});

		test("Exposes capitalise to the current-time slot", () => {
			let receivedProps = null;

			mount({
				props: {
					capitalise: false,
					date: relativeTo,
				},
				slots: {
					default: (slotProps) => {
						receivedProps = slotProps;

						return "translated current time";
					},
				},
			});

			expect(receivedProps).toMatchObject({
				capitalise: false,
				unit: "second",
				value: 0,
			});
		});
	});

	describe("Computed", () => {
		describe("relativeDate", () => {
			test("Returns seconds ago for dates less than 60 seconds ago", () => {
				const wrapper = mount({ date: "2025-03-29T13:14:50" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("30 seconds ago");
			});

			test("Rounds seconds up to minutes", () => {
				const wrapper = mount({ date: "2025-03-29T13:14:19" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("1 minute ago");
			});

			test("Returns minutes ago for dates less than 60 minutes ago", () => {
				const wrapper = mount({ date: "2025-03-29T12:45:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("30 minutes ago");
			});

			test("Rounds minutes up to hours", () => {
				const wrapper = mount({ date: "2025-03-29T12:14:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("1 hour ago");
			});

			test("Returns hours ago for dates less than 24 hours ago", () => {
				const wrapper = mount({ date: "2025-03-29T08:15:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("5 hours ago");
			});

			test("Returns one day ago after 24 hours", () => {
				const wrapper = mount({ date: "2025-03-28T13:14:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("Yesterday");
			});

			test("Does not round one day ago up to two days ago", () => {
				const wrapper = mount({ date: "2025-03-27T13:16:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("Yesterday");
			});

			test("Returns two days ago after 48 hours", () => {
				const wrapper = mount({ date: "2025-03-27T13:15:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("2 days ago");
			});

			test("Returns months ago after 30 days", () => {
				const wrapper = mount({ date: "2025-02-27T13:15:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("Last month");
			});

			test("Returns years ago after 365 days", () => {
				const wrapper = mount({ date: "2024-03-29T13:15:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("Last year");
			});

			test("Allows capitalisation to be disabled", () => {
				const wrapper = mount({
					capitalise: false,
					date: "2025-03-28T13:14:20",
				});

				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("yesterday");
			});

			test("Returns future relative dates", () => {
				const wrapper = mount({ date: "2025-03-29T13:16:20" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("In 1 minute");
			});

			test("Allows a custom locale to be provided", () => {
				const wrapper = mount({ date: "2025-03-29T13:14:20", locale: "de-DE" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBe("Vor 1 Minute");
			});

			test("Returns null for unsupported dates", () => {
				const wrapper = mount({ date: "invalid-date" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBeNull();
			});

			test("Returns null for unsupported relativeTo dates", () => {
				const wrapper = mount({ relativeTo: "invalid-date" });
				const vm = wrapper.vm;

				expect(vm.relativeDate).toBeNull();
			});
		});
	});
});
