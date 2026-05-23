import { createMount } from "@unit/support/mount";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";
import CopyContent from "./copy-content.vue";

const defaultProps = { content: "Content to copy" };
const mount = createMount(CopyContent, { props: defaultProps });

describe("copy-content", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("successLabel", () => {
			test("Defaults to 'Copied' when the slot is empty", () => {
				const wrapper = mount();

				expect(wrapper.vm.successLabel).toBe("Copied");
			});

			test("Uses the slot text when provided", () => {
				const wrapper = mount({
					slots: {
						"copy-success-label": "Copied to clipboard",
					},
				});

				expect(wrapper.vm.successLabel).toBe("Copied to clipboard");
			});
		});

		describe("errorLabel", () => {
			test("Defaults to 'Error' when the slot is empty", () => {
				const wrapper = mount();

				expect(wrapper.vm.errorLabel).toBe("Error");
			});

			test("Uses the slot text when provided", () => {
				const wrapper = mount({
					slots: {
						"copy-error-label": "Failed to copy",
					},
				});

				expect(wrapper.vm.errorLabel).toBe("Failed to copy");
			});
		});
	});

	describe("Methods", () => {
		describe("announceStatus", () => {
			beforeEach(() => {
				vi.useFakeTimers();
			});

			afterEach(() => {
				vi.useRealTimers();
			});

			test("Clears the status message before setting it", async () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.statusMessage = "Old message";
				vm.announceStatus("New message");

				expect(vm.statusMessage).toBe("");

				vi.advanceTimersByTime(100);
				await nextTick();

				expect(vm.statusMessage).toBe("New message");
			});

			test("Re-announces when called repeatedly", async () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.announceStatus("Copied");

				vi.advanceTimersByTime(100);
				await nextTick();

				expect(vm.statusMessage).toBe("Copied");

				vm.announceStatus("Copied");

				expect(vm.statusMessage).toBe("");

				vi.advanceTimersByTime(100);
				await nextTick();

				expect(vm.statusMessage).toBe("Copied");
			});
		});
	});
});
