import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import AlertMessage from "./alert-message.vue";

const defaultProps = { type: "muted" };
const mount = createMount(AlertMessage, { props: defaultProps });

describe("alert-message", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("alertType", () => {
			test("should recognise a valid alert type", () => {
				const wrapper = mount({ type: "success" });
				const vm = wrapper.vm;

				expect(vm.alertType).toBe("success");
			});

			test("should ignore an invalid alert type", () => {
				const wrapper = mount({ type: "invalid" });
				const vm = wrapper.vm;

				expect(vm.alertType).toBe("muted");
			});
		});

		describe("alertRole", () => {
			test.each([
				["error", "alert"],
				["warning", "alert"],
				["success", "status"],
				["info", "status"],
				["muted", "status"],
			])("should return the correct role for type %s", (type, expectedRole) => {
				const wrapper = mount({ type, live: true });
				const vm = wrapper.vm;

				expect(vm.alertRole).toBe(expectedRole);
			});

			test("should return null when live is false", () => {
				const wrapper = mount({ type: "error", live: false });
				const vm = wrapper.vm;

				expect(vm.alertRole).toBeNull();
			});
		});

		describe("alertLive", () => {
			test("should return polite for status roles", () => {
				const wrapper = mount({ type: "success", live: true });
				const vm = wrapper.vm;

				expect(vm.alertLive).toBe("polite");
			});

			test("should return null for alert roles", () => {
				const wrapper = mount({ type: "error", live: true });
				const vm = wrapper.vm;

				expect(vm.alertLive).toBeNull();
			});

			test("should return null when live is false", () => {
				const wrapper = mount({ type: "success", live: false });
				const vm = wrapper.vm;

				expect(vm.alertLive).toBeNull();
			});
		});

		describe("alertPrefix", () => {
			test.each([
				["error", "Error"],
				["warning", "Warning"],
				["success", "Success"],
				["info", "Info"],
				["muted", "Muted"],
			])("should capitalise the first character for type %s", (type, expectedPrefix) => {
				const wrapper = mount({ type });
				const vm = wrapper.vm;

				expect(vm.alertPrefix).toBe(expectedPrefix);
			});
		});
	});
});
