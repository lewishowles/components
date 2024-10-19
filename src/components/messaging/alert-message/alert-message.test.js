import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
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
	});
});
